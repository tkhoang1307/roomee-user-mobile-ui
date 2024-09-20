import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, View} from 'react-native';
import dayjs from 'dayjs';

import {globalStyles} from '@styles';
import TextComponent from '@components/TextComponent';
import {EditInvoiceScreenProps} from '@models/navigators/HomNavigator';
import {CreationInvoiceItemModel, CreationInvoiceItemPropertyModel} from '@models/invoices';
import {invoiceService} from '@services';
import {ErrorResponseAxios} from '@models/error';
import {ScrollView} from 'react-native-gesture-handler';
import {styles} from './styles';
import {DATE_PICKER_FORMAT} from '@const/index';
import TitleComponent from '@components/TitleComponent';
import DateTimePicker from '@components/DatetimePicker';
import ViewDetailInvoiceCreation from '../components/ViewDetailInvoiceCreation';
import RemoveInvoiceConfirmationModal from '../components/RemoveInvoiceConfirmationModal';
import ExportInvoiceConfirmationModal from '../components/ExportInvoiceConfirmationModal';
import InvoiceStateTag from '@components/InvoiceStateTag';
import {Button} from '@ant-design/react-native';
import { InvoiceStateEnum } from '@const/invoice';

const EditInvoiceScreen: React.FC<EditInvoiceScreenProps> = ({
  route,
  navigation,
}) => {
  const {t} = useTranslation();
  const today = new Date();
  const {accommodationId, roomId, invoiceId} = route.params;
  const [modalOpenRemove, setModalOpenRemove] = useState<boolean>(false);
  const [modalOpenExport, setModalOpenExport] = useState<boolean>(false);
  const [invoiceDate, setInvoiceDate] = useState<Date>(today);
  const [dueDate, setDueDate] = useState<Date>(today);
  const [invoiceState, setInvoiceState] = useState<string>('');
  const [serviceInvoiceItems, setServiceInvoiceItems] = useState<
    Array<CreationInvoiceItemModel>
  >([]);
  const [originalServiceInvoiceItems, setOriginalServiceInvoiceItems] = useState<
    Array<CreationInvoiceItemModel>
  >([]);
  const [propertyInvoiceItems, setPropertyInvoiceItems] = useState<
    Array<CreationInvoiceItemPropertyModel>
  >([]);
  const [originalPropertyInvoiceItems, setOriginalPropertyInvoiceItems] = useState<
    Array<CreationInvoiceItemPropertyModel>
  >([]);
  const [initialElectric, setInitialElectric] = useState<number>(0);
  const [initialWater, setInitialWater] = useState<number>(0);

  useEffect(() => {
    const getDetailInvoiceById = async () => {
      try {
        const resData = await invoiceService.getDetailInvoice(invoiceId);
        const payloadServiceInvoiceItems = resData.items.map(service => {
          return {
            key: service.roomTenantServiceId,
            roomTenantServiceId: service.roomTenantServiceId,
            name: service.name,
            unit: service.unit,
            cost: service.cost,
            quantity: service.quantity,
            meta: service.meta,
          };
        });

        const payloadOtherInvoiceItems = !resData.others ? [] : resData.others?.map((item) => {
          return {
            id: item.id,
            key: item.id,
            roomTenantPropertyId: item.id,
            name: item.name,
            cost: item.cost,
            quantity: item.quantity,
          };
        });

        setServiceInvoiceItems(payloadServiceInvoiceItems);
        setOriginalServiceInvoiceItems(payloadServiceInvoiceItems);
        setPropertyInvoiceItems(payloadOtherInvoiceItems);
        setOriginalPropertyInvoiceItems(payloadOtherInvoiceItems);
        setInvoiceState(resData.state);
        setDueDate(dayjs(resData.dueDate, DATE_PICKER_FORMAT).toDate());
        setInvoiceDate(dayjs(resData.invoiceDate, DATE_PICKER_FORMAT).toDate());
      } catch (error: any) {
        Alert.alert(
          t(`alertTitle.noti`),
          (error as ErrorResponseAxios).response.data.message,
        );
      }
    };

    getDetailInvoiceById();
  }, []);

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
      }
    };

    getAllInvoicesOfRoom();
  }, [accommodationId, roomId]);


  const findUniqueElements = (arrA: string[], arrB: string[]): string[] => {
    // Create a set which contain the elements of arrB
    const setB = new Set(arrB);
  
    // Filter elements which are in arrA but not be in arrB
    const uniqueElementsInA = arrA.filter(element => !setB.has(element));
  
    return uniqueElementsInA;
  };

  const handleRemoveServiceInvoiceItems = () => {
    try {
      // delete items
      const arrIdsOriginalServiceInvoiceItems = originalServiceInvoiceItems
        .map((service) => service.roomTenantServiceId)
        .filter((roomTenantServiceId): roomTenantServiceId is string => roomTenantServiceId !== undefined);

      const arrIdsServiceInvoiceItems = serviceInvoiceItems
        .map((service) => service.roomTenantServiceId)
        .filter((roomTenantServiceId): roomTenantServiceId is string => roomTenantServiceId !== undefined);
      
      const arrRoomTenantServiceIdsItemNeedToDelete = findUniqueElements(arrIdsOriginalServiceInvoiceItems, arrIdsServiceInvoiceItems);

      const arrIdsItemNeedToDelete = originalServiceInvoiceItems
        .filter(item => arrRoomTenantServiceIdsItemNeedToDelete.includes(item.roomTenantServiceId))
        .map(item => item.id)
        .filter((id): id is string => id !== undefined);

      arrIdsItemNeedToDelete.map(async (item) => {
        await invoiceService.deleteInvoiceItem(invoiceId, item);
      });
    } catch(error: any) {
      Alert.alert(
        t(`alertTitle.noti`),
        (error as ErrorResponseAxios).response.data.message,
      );
    }
  }

  const handleRemoveOtherInvoiceItems = () => {
    try {
      // delete other items
      const arrIdsOriginalPropertyInvoiceItems = originalPropertyInvoiceItems
        .map((service) => service.id)
        .filter((id): id is string => id !== undefined);

      const arrIdsPropertyInvoiceItems = propertyInvoiceItems
        .map((service) => service.id)
        .filter((id): id is string => id !== undefined);
      
      const arrIdsItemNeedToDelete = findUniqueElements(arrIdsOriginalPropertyInvoiceItems, arrIdsPropertyInvoiceItems);

      arrIdsItemNeedToDelete.map(async (item) => {
        await invoiceService.deleteOtherInvoiceItem(invoiceId, item);
      });
    } catch(error: any) {
      Alert.alert(
        t(`alertTitle.noti`),
        (error as ErrorResponseAxios).response.data.message,
      );
    }
  }

  const handleEditInvoice = async () => {
    try {
      if (!dueDate || !invoiceDate) {
        Alert.alert(t(`alertTitle.noti`), t(`alertContent.fillNotEnough`));
        return;
      }

      //handle remove service invoice items
      handleRemoveServiceInvoiceItems();

      //handle remove other invoice items
      handleRemoveOtherInvoiceItems();

      const payloadServices = serviceInvoiceItems.map(service => {
        return {
          quantity: service.quantity,
          roomTenantServiceId: service.roomTenantServiceId,
          meta: service.meta,
        };
      });

      const payloadOtherItems = propertyInvoiceItems.map((item) => {
        return {
          id: item.id,
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

      await invoiceService.updateInvoiceById(invoiceId || '', payload);

      navigation.goBack();
    } catch (error: any) {
      Alert.alert(
        t(`alertTitle.noti`),
        (error as ErrorResponseAxios).response.data.message,
      );
    }
  };

  return (
    <View style={globalStyles.container}>
      <TitleComponent
        back
        title={t('actions.editInvoice')}
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
          <View style={styles.headerInvoice}>
            <View style={styles.headerInvoiceItemCenter}>
              <TextComponent styles={[styles.itemTitle]}>
                {t('invoice.state')}:{' '}
              </TextComponent>
              <InvoiceStateTag state={invoiceState} />
            </View>
          </View>
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
            mode={'edit'}
          />
          <View style={{rowGap: 8}}>
            <Button type="ghost" onPress={() => handleEditInvoice()}>
              {t('actions.saveEdits')}
            </Button>
            <Button
              onPress={() => setModalOpenRemove(true)}
              type="warning"
            >
              {t('actions.deleteInvoice')}
            </Button>

            <Button type="primary" onPress={() => setModalOpenExport(true)}>
              {t('actions.exportInvoice')}
            </Button>
          </View>
        </View>
      </ScrollView>
      <RemoveInvoiceConfirmationModal
        invoiceId={invoiceId}
        roomId={roomId}
        accommodationId={accommodationId}
        modalOpenRemove={modalOpenRemove}
        setModalOpenRemove={setModalOpenRemove}
        navigation={navigation}
      />
      <ExportInvoiceConfirmationModal
        invoiceId={invoiceId}
        roomId={roomId}
        accommodationId={accommodationId}
        modalOpenExport={modalOpenExport}
        setModalOpenExport={setModalOpenExport}
        navigation={navigation}
      />
    </View>
  );
};

export default EditInvoiceScreen;
