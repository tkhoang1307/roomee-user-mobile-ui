import {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, View} from 'react-native';

import {globalStyles} from '@styles';
import TextComponent from '@components/TextComponent';
import {CreateInvoiceScreenProps} from '@models/navigators/HomNavigator';
import {CreationInvoiceItemModel, CreationInvoiceItemPropertyModel} from '@models/invoices';
import {invoiceService, serviceUtilityServices} from '@services';
import {ErrorResponseAxios} from '@models/error';
import TitleComponent from '@components/TitleComponent';
import {ScrollView} from 'react-native-gesture-handler';
import {styles} from './styles';
import DateTimePicker from '@components/DatetimePicker';
import ButtonComponent from '@components/ButtonComponent';
import ViewDetailInvoiceCreation from '../components/ViewDetailInvoiceCreation';
import {InvoiceStateEnum} from '@const/invoice';

const CreateInvoiceScreen: React.FC<CreateInvoiceScreenProps> = ({
  route,
  navigation,
}) => {
  const {t} = useTranslation();
  const {roomId, accommodationId} = route.params;
  const today = useMemo(() => new Date(), []);
  const defaultDueDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d;
  }, []);
  const [invoiceDate, setInvoiceDate] = useState<Date>(today);
  const [dueDate, setDueDate] = useState<Date>(defaultDueDate);
  const [loading, setLoading] = useState(false);
  const [serviceInvoiceItems, setServiceInvoiceItems] = useState<
    CreationInvoiceItemModel[]
  >([]);
  const [propertyInvoiceItems, setPropertyInvoiceItems] = useState<
    Array<CreationInvoiceItemPropertyModel>
  >([]);
  const [initialElectric, setInitialElectric] = useState<number>(0);
  const [initialWater, setInitialWater] = useState<number>(0);

  useEffect(() => {
    const addAllRoomServicesForInvoice = async () => {
      try {
        const resDataRoomService =
          await serviceUtilityServices.getAllServicesForRoom(
            roomId || '',
            'ALL',
          );
        //sort service
        resDataRoomService.sort((a, b) => {
          if (a.type === 'PRIMARY' && b.type !== 'PRIMARY') {
            return -1;
          } else if (a.type !== 'PRIMARY' && b.type === 'PRIMARY') {
            return 1;
          }
          return b.cost - a.cost;
        });
        const payloadServiceInvoiceItems = resDataRoomService
          .filter(service => !service.deleted)
          .map(service => {
            return {
              key: service.id,
              roomTenantServiceId: service.id,
              name: service.name,
              unit: service.unit,
              cost: service.cost,
              quantity:
                service.name == 'electric' ||
                (service.name == 'water' && service.unit == 'm3')
                  ? 0
                  : 1,
            };
          });
        setServiceInvoiceItems(payloadServiceInvoiceItems);
      } catch (error: any) {
        Alert.alert(
          t(`alertTitle.noti`),
          (error as ErrorResponseAxios).response.data.message,
        );
      }
    };

    addAllRoomServicesForInvoice();
  }, []);

  const handleCreateInvoice = async () => {
    try {
      setLoading(true);
      if (!dueDate || !invoiceDate) {
        Alert.alert(t(`alertTitle.noti`), t(`alertContent.fillNotEnough`));
        return;
      }

      const payloadServices = serviceInvoiceItems.map(service => {
        return {
          quantity: service.quantity,
          roomTenantServiceId: service.roomTenantServiceId,
          meta: service.meta,
        };
      });

      const payloadOtherItems = propertyInvoiceItems.map((item) => {
        return {
          name: item.name,
          quantity: item.quantity,
          cost: item.cost,
        };
      });

      const payload = {
        roomId: roomId || '',
        dueDate: dueDate,
        invoiceDate: invoiceDate,
        services: payloadServices,
        others: payloadOtherItems,
      };

      await invoiceService.createInvoice(payload);
      //   Alert.alert(t(`alertTitle.noti`), t('success.createInvoice'));
      navigation.goBack();
      //   .navigate('DetailInvoiceScreen', {
      //     accommodationId: accommodationId,
      //     roomId: roomId,
      //     invoiceId: newInvoice.id,
      //   });
    } catch (error: any) {
      Alert.alert(
        t(`alertTitle.noti`),
        (error as ErrorResponseAxios).response.data.message,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getAllInvoicesOfRoom = async () => {
      try {
        const invoices = await invoiceService.getAllInvoicesOfRoom(
          accommodationId,
          roomId,
        );
        const filteredInvoices = invoices
          .filter(i => i.state !== InvoiceStateEnum.DRAFT)
          .sort((a, b) => {
            const x = new Date(a.invoiceDate);
            const y = new Date(b.invoiceDate);
            return y.getTime() - x.getTime();
          });
        if (filteredInvoices.length > 0) {
          const lastestInvoice = await invoiceService.getDetailInvoice(
            filteredInvoices[0].id,
          );

          lastestInvoice.items.forEach(i => {
            if (i.name === 'electric') {
              if (i.meta?.newIndicator) setInitialElectric(i.meta.newIndicator);
            }
            if (i.name === 'water' && i.unit === 'm3') {
              if (i.meta?.newIndicator) setInitialWater(i.meta.newIndicator);
            }
          });
        }
      } catch (error: any) {
        Alert.alert(
          t(`alertTitle.noti`),
          (error as ErrorResponseAxios).response.data.message,
        );
      } finally {
        setLoading(false);
      }
    };

    getAllInvoicesOfRoom();
  }, [accommodationId, roomId]);

  return (
    <View style={globalStyles.container}>
      <TitleComponent
        back
        title={t('actions.createInvoice')}
        titleStyle={{fontSize: 20, marginTop: -2}}
      />

      <ScrollView>
        <View style={styles.container}>
          <View style={styles.headerInvoice}>
            <View style={styles.headerInvoiceItemCenter}>
              <TextComponent styles={[styles.itemTitle, styles.upSize]}>
                {t('invoice.invoiceTitle')}
              </TextComponent>
            </View>
          </View>
          <View style={styles.line} />
          <View>
            <View style={styles.headerInvoice}>
              <View style={styles.headerInvoiceItemCenter}>
                <TextComponent styles={styles.itemText}>
                  {t('invoice.invoiceDate')}
                </TextComponent>
              </View>
              <View style={styles.headerInvoiceItemCenter}>
                <TextComponent styles={styles.itemText}>
                  {t('invoice.dueDate')}
                </TextComponent>
              </View>
            </View>
            <View style={styles.headerInvoice}>
              <View style={[styles.headerInvoiceItemCenter, {paddingRight: 4}]}>
                <DateTimePicker
                  type="date"
                  onSelect={val => setInvoiceDate(new Date(val))}
                  selected={invoiceDate}
                />
              </View>
              <View style={[styles.headerInvoiceItemCenter, {paddingLeft: 4}]}>
                <DateTimePicker
                  type="date"
                  onSelect={val => setDueDate(new Date(val))}
                  selected={dueDate}
                  minDate={today}
                />
              </View>
            </View>
          </View>
          <ViewDetailInvoiceCreation
            roomId={roomId}
            serviceInvoiceItems={serviceInvoiceItems}
            setServiceInvoiceItems={setServiceInvoiceItems}
            initialElectric={initialElectric}
            initialWater={initialWater}
            propertyInvoiceItems={propertyInvoiceItems}
            setPropertyInvoiceItems={setPropertyInvoiceItems}
            mode={'create'}
          />
          <ButtonComponent
            text={t('actions.createInvoice')}
            onPress={handleCreateInvoice}
            type="primary"
            loading={loading}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default CreateInvoiceScreen;
