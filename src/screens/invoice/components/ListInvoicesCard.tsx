import {useEffect, useState} from 'react';
import {ActivityIndicator, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Alert, View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {globalStyles} from '@styles';
import {Can} from '@context';
import {RootStackParamList} from '@models/navigators/HomNavigator';
import {AbilityActionEnum, AbilitySubjectEnum} from '@const/abilities';
import CardTitleWithSharp from '@components/CardTitleWithSharp';
import {invoiceService} from '@services';
import {ErrorResponseAxios} from '@models/error';
import TextComponent from '@components/TextComponent';
import {appColors} from '@const/appColors';
import {InvoiceModel} from '@models/invoices';
import BasicInvoiceCard from './BasicInvoiceCard';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ContractModel} from '@models/contract';

interface ListInvoicesCardProps {
  loading: boolean;
  roomId: string;
  accommodationId: string;
  currentContract?: boolean;
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'DetailRoomScreen',
    undefined
  >;
  contract?: ContractModel;
  reloadFlag: boolean;
}

const ListInvoicesCard: React.FC<ListInvoicesCardProps> = ({
  loading,
  roomId,
  accommodationId,
  currentContract,
  navigation,
  contract,
  reloadFlag,
}) => {
  const {t} = useTranslation();
  const [listInvoices, setListInvoices] = useState<Array<InvoiceModel>>([]);

  useEffect(() => {
    const getAllInvoicesOfRoom = async () => {
      try {
        const resData = await invoiceService.getAllInvoicesOfRoom(
          accommodationId,
          roomId,
        );
        const currentMonth = moment().month();
        const filteredInvoices = resData.filter((invoice: InvoiceModel) => {
          return moment(invoice.invoiceDate).month() === currentMonth;
        });
        setListInvoices(filteredInvoices);
      } catch (error: any) {
        Alert.alert(
          t(`alertTitle.noti`),
          (error as ErrorResponseAxios).response.data.message,
        );
      } finally {
      }
    };

    getAllInvoicesOfRoom();
  }, [accommodationId, roomId, reloadFlag]);

  return (
    <View style={globalStyles.cardInfo}>
      <CardTitleWithSharp title={t(`pageTitle.listInvoices`)}>
        {contract && (
          <Can I={AbilityActionEnum.CREATE} a={AbilitySubjectEnum.INVOICE}>
            <TouchableOpacity
              style={globalStyles.iconButton}
              onPress={() => {
                navigation?.navigate('CreateInvoiceScreen', {
                  roomId: roomId,
                  accommodationId: accommodationId,
                });
              }}>
              <Icon name="plus" size={30} />
            </TouchableOpacity>
          </Can>
        )}
        <TouchableOpacity
          style={{marginRight: 4, marginLeft: 4}}
          onPress={() => {
            navigation?.navigate('ListInvoicesScreen', {
              roomId: roomId,
              accommodationId: accommodationId,
            });
          }}>
          <TextComponent>{t('actions.viewMore')}</TextComponent>
        </TouchableOpacity>
      </CardTitleWithSharp>

      <View style={{paddingHorizontal: 8, paddingVertical: 8, rowGap: 8}}>
        {loading ? (
          <View
            style={{
              minHeight: 100,
              justifyContent: 'center',
              alignItems: 'center',
              rowGap: 8,
            }}>
            <ActivityIndicator size={30} color={appColors.primary} />
          </View>
        ) : !currentContract ? (
          <View
            style={{
              minHeight: 100,
              justifyContent: 'center',
              alignItems: 'center',
              rowGap: 8,
            }}>
            <TextComponent>{t('label.emptyRoom')}</TextComponent>
          </View>
        ) : listInvoices.length > 0 ? (
          <>
            {listInvoices.map(invoice => (
              <BasicInvoiceCard
                key={invoice.id}
                invoice={invoice}
                accommodationId={accommodationId}
                roomId={roomId}
                navigation={navigation}
              />
            ))}
          </>
        ) : (
          <View
            style={{
              minHeight: 100,
              justifyContent: 'center',
              alignItems: 'center',
              rowGap: 8,
            }}>
            <TextComponent>{t('label.emptyCurrentInvoice')}</TextComponent>
          </View>
        )}
      </View>
    </View>
  );
};

export default ListInvoicesCard;
