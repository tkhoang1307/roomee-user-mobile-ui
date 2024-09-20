import {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, Alert, Platform, View} from 'react-native';

import {globalStyles} from '@styles';
import {appColors} from '@const/appColors';
import {ListInvoicesScreenProps} from '@models/navigators/HomNavigator';
import {InvoiceModel} from '@models/invoices';
import {invoiceService} from '@services';
import {ErrorResponseAxios} from '@models/error';
import InvoiceCard from './components/InvoiceCard';
import TitleComponent from '@components/TitleComponent';
import {ScrollView} from 'react-native-gesture-handler';
import CircleComponent from '@components/CircleComponent';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {styles} from './styles';
import {listInvoiceStates} from '@utils/invoice';
import InvoiceStateTag from '@components/InvoiceStateTag';
import {Popover} from '@ant-design/react-native';
import {IconOutline} from '@ant-design/icons-react-native';
import {Can} from '@context';
import {AbilityActionEnum, AbilitySubjectEnum} from '@const/abilities';
import EmptyList from '@components/EmptyList';

const Item = Popover.Item;

const ListInvoicesScreen: React.FC<ListInvoicesScreenProps> = ({
  route,
  navigation,
}) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const {roomId, accommodationId} = route.params;
  const [reloadFlag, setReloadFlag] = useState(false);
  const [listInvoices, setListInvoices] = useState<Array<InvoiceModel>>([]);
  const [selectedInvoiceState, setSelectedInvoiceState] = useState('ALL');

  useEffect(() => {
    const getAllInvoicesOfRoom = async () => {
      try {
        setLoading(true);
        if (selectedInvoiceState === 'ALL') {
          const resData = await invoiceService.getAllInvoicesOfRoom(
            accommodationId,
            roomId,
          );
          setListInvoices(
            resData.sort((a, b) => {
              const x = new Date(a.invoiceDate);
              const y = new Date(b.invoiceDate);
              return y.getTime() - x.getTime();
            }),
          );
        } else {
          const resFilterData = await invoiceService.paginateInvoices({
            accommodationId,
            roomId,
            state: selectedInvoiceState,
          });
          setListInvoices(
            resFilterData.sort((a, b) => {
              const x = new Date(a.invoiceDate);
              const y = new Date(b.invoiceDate);
              return y.getTime() - x.getTime();
            }),
          );
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
  }, [accommodationId, roomId, selectedInvoiceState, reloadFlag]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // do something
      setReloadFlag(pre => !pre);
    });

    return unsubscribe;
  }, [navigation]);

  const memoizedInvoices = useMemo(() => {
    return listInvoices.map(invoice => (
      <InvoiceCard
        key={invoice.id}
        invoice={invoice}
        navigation={navigation}
        accommodationId={accommodationId}
        roomId={roomId}
      />
    ));
  }, [accommodationId, roomId, listInvoices]);

  const handleSelectInvoiceState = (value: string) => {
    setSelectedInvoiceState(value);
  };

  const overlayInvoiceState = listInvoiceStates.map((item, index) => (
    <Item key={index} value={item.value} style={{padding: 4}}>
      <InvoiceStateTag state={item.label} />
    </Item>
  ));

  return (
    <View style={globalStyles.container}>
      <TitleComponent
        back
        title={t(`pageTitle.listInvoices`)}
        titleStyle={{fontSize: 16, marginTop: -2}}
      />
      <View
        style={{
          width: 190,
          marginTop: 10,
          alignSelf: 'flex-end',
          marginRight: 8,
        }}>
        <Popover
          overlay={overlayInvoiceState}
          placement={'bottom'}
          onSelect={handleSelectInvoiceState}>
          <View
            style={[
              styles.dropdownContainer,
              {
                borderColor: appColors.gray2,
              },
            ]}>
            <View style={{width: '90%'}}>
              {selectedInvoiceState === '' ? (
                <InvoiceStateTag state="ALL" />
              ) : (
                <InvoiceStateTag state={selectedInvoiceState} />
              )}
            </View>
            <IconOutline name="down" />
          </View>
        </Popover>
      </View>
      <View style={{flex: 1, paddingVertical: 4}}>
        {loading ? (
          <View
            style={{
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size={30} color={appColors.primary} />
          </View>
        ) : listInvoices.length > 0 ? (
          <ScrollView>
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 8,
                rowGap: 8,
                height: '100%',
              }}>
              {memoizedInvoices}
            </View>
          </ScrollView>
        ) : (
          <EmptyList>{t('invoice.notInvoice')}</EmptyList>
        )}
      </View>

      <Can I={AbilityActionEnum.CREATE} a={AbilitySubjectEnum.INVOICE}>
        <CircleComponent
          onPress={() => {
            navigation?.navigate('CreateInvoiceScreen', {
              accommodationId: accommodationId,
              roomId: roomId,
            });
          }}
          size={55}
          styles={[
            styles.addButton,
            globalStyles.shadow,
            {marginTop: Platform.OS === 'ios' ? -50 : -60},
          ]}>
          <Icon name="plus" size={30} color={appColors.white} />
        </CircleComponent>
      </Can>
    </View>
  );
};

export default ListInvoicesScreen;
