import {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, Alert, TouchableOpacity, View} from 'react-native';

import {globalStyles} from '@styles';
import {appColors} from '@const/appColors';
import {ListInvoicesOfAccommodationScreenProps} from '@models/navigators/HomNavigator';
import {InvoiceModel} from '@models/invoices';
import {invoiceService} from '@services';
import {ErrorResponseAxios} from '@models/error';
import TitleComponent from '@components/TitleComponent';
import {ScrollView} from 'react-native-gesture-handler';
import {styles} from './styles';
import {listInvoiceStates} from '@utils/invoice';
import InvoiceStateTag from '@components/InvoiceStateTag';
import {Popover, TextareaItem} from '@ant-design/react-native';
import {IconOutline} from '@ant-design/icons-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useRoomName from '@hk/useRoomName';
import EmptyList from '@components/EmptyList';
import InvoiceCard from './components/InvoiceCard';

const Item = Popover.Item;

const ListInvoicesOfAccommodationScreen: React.FC<
  ListInvoicesOfAccommodationScreenProps
> = ({route, navigation}) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const {accommodationId} = route.params;
  const [listInvoices, setListInvoices] = useState<Array<InvoiceModel>>([]);
  const [selectedInvoiceState, setSelectedInvoiceState] = useState('ALL');
  const [roomName, setRoomName] = useState<string>();
  const [roomId, setRoomId] = useState<string>();
  const accom = useMemo(() => route.params.accom, []);
  const {getRoomNameFromId, getRoomIdFromRoomname} = useRoomName({
    rooms: accom.rooms || [],
  });

  useEffect(() => {
    const getAllInvoicesOfRoom = async () => {
      try {
        setLoading(true);
        if (selectedInvoiceState === 'ALL') {
          if (roomId) {
            const resFilterRoomData = await invoiceService.paginateInvoices({
              accommodationId,
              roomId,
            });
            setListInvoices(
              resFilterRoomData.sort((a, b) => {
                const x = new Date(a.invoiceDate);
                const y = new Date(b.invoiceDate);
                return y.getTime() - x.getTime();
              }),
            );
          } else {
            const resAllData = await invoiceService.paginateInvoices({
              accommodationId,
            });
            setListInvoices(
              resAllData.sort((a, b) => {
                const x = new Date(a.invoiceDate);
                const y = new Date(b.invoiceDate);
                return y.getTime() - x.getTime();
              }),
            );
          }
        } else {
          if (roomId) {
            const resFilterFullData = await invoiceService.paginateInvoices({
              accommodationId,
              roomId,
              state: selectedInvoiceState,
            });
            setListInvoices(
              resFilterFullData.sort((a, b) => {
                const x = new Date(a.invoiceDate);
                const y = new Date(b.invoiceDate);
                return y.getTime() - x.getTime();
              }),
            );
          } else {
            const resFilterStateData = await invoiceService.paginateInvoices({
              accommodationId,
              state: selectedInvoiceState,
            });
            setListInvoices(
              resFilterStateData.sort((a, b) => {
                const x = new Date(a.invoiceDate);
                const y = new Date(b.invoiceDate);
                return y.getTime() - x.getTime();
              }),
            );
          }
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
  }, [accommodationId, selectedInvoiceState, roomId]);

  const memoizedInvoices = useMemo(() => {
    return listInvoices.map(invoice => (
      <InvoiceCard
        key={invoice.id}
        invoice={invoice}
        navigation={navigation}
        accommodationId={accommodationId}
        roomId={invoice.roomId}
      />
    ));
  }, [accommodationId, listInvoices, roomId]);

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
        titleStyle={{fontSize: 20, marginTop: -2}}
      />
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          width: '100%',
          flexWrap: 'wrap',
          rowGap: 4,
          paddingHorizontal: 8,
          paddingVertical: 8,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TextareaItem
            rows={1}
            placeholder={t('label.roomName') + ' ...'}
            style={{
              borderRadius: 12,
              borderColor: appColors.gray2,
              borderWidth: 1,
              paddingRight: 16,
              paddingLeft: 16,
              height: 40,
              width: 140,
              paddingBottom: 4,
            }}
            onChange={e => setRoomName(e || undefined)}
            value={roomName}
            onBlur={() => {
              const newRoomId = roomName
                ? getRoomIdFromRoomname(roomName)
                : undefined;
              setRoomId(newRoomId);
            }}
          />
          <TouchableOpacity
            style={{
              opacity: roomName && roomName.length > 0 ? undefined : 0,
            }}
            disabled={roomName && roomName.length > 0 ? false : true}
            onPress={() => {
              if (
                roomName?.toLowerCase() !==
                getRoomNameFromId(roomId || '')?.toLowerCase()
              ) {
                setRoomName(undefined);
                return;
              }
              setRoomId(undefined);
              setRoomName(undefined);
            }}>
            <Icon
              name="close"
              size={20}
              color={appColors.gray}
              style={{fontWeight: 'bold'}}
            />
          </TouchableOpacity>
        </View>

        <View style={{width: 190}}>
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
      </View>
      <View style={{flex: 1, paddingBottom: 4}}>
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
    </View>
  );
};

export default ListInvoicesOfAccommodationScreen;
