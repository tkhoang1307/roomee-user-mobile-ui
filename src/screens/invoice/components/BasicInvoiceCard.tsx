import moment from 'moment';
import {useTranslation} from 'react-i18next';
import {fontFamilies} from '@const/fontFamilies';
import {TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {globalStyles} from '@styles';
import {appColors} from '@const/appColors';
import TextComponent from '@components/TextComponent';
import {InvoiceModel} from '@models/invoices';
import {
  DATE_PICKER_FORMAT,
  MONEY_FORMAT_BY,
  MONTH_PICKER_FORMAT,
} from '@const/index';
import InvoiceStateTag from '@components/InvoiceStateTag';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '@models/navigators/HomNavigator';

interface BasicInvoiceCardProps {
  invoice: InvoiceModel;
  accommodationId: string;
  roomId: string;
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'DetailRoomScreen',
    undefined
  >;
}

const BasicInvoiceCard: React.FC<BasicInvoiceCardProps> = ({
  invoice,
  navigation,
  roomId,
  accommodationId,
}) => {
  const {t} = useTranslation();

  return (
    <TouchableOpacity
      style={{
        ...globalStyles.borderInfoStyle,
        width: '100%',
        paddingVertical: 8,
        paddingHorizontal: 12,
        rowGap: 1,
        backgroundColor: appColors.white,
      }}
      onPress={() => {
        if (invoice.state === 'DRAFT') {
          navigation?.navigate('EditInvoiceScreen', {
            invoiceId: invoice.id,
            roomId: roomId || '',
            accommodationId: accommodationId,
          });
        } else {
          navigation?.navigate('DetailInvoiceScreen', {
            invoiceId: invoice.id,
            accommodationId: accommodationId,
            roomId: roomId,
          });
        }
      }}>
      <View style={{flexDirection: 'row', columnGap: 16}}>
        <View
          style={{
            backgroundColor: appColors.primary,
            borderRadius: 25,
            height: 50,
            width: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name="hand-coin-outline" size={24} />
        </View>
        <View style={{flexGrow: 1}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextComponent
              styles={{fontFamily: fontFamilies.bold, fontSize: 15, flex: 1}}>
              {invoice.name}
            </TextComponent>
          </View>
        </View>
      </View>
      <View style={{marginTop: 16}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}>
          <View style={{flex: 2, flexDirection: 'row', alignItems: 'center'}}>
            <TextComponent>
              {t('invoice.dueDate')}:{' '}
              {`${moment(invoice.dueDate).format(DATE_PICKER_FORMAT)}`}
            </TextComponent>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
            <TextComponent>{`${moment(invoice.invoiceDate).format(
              MONTH_PICKER_FORMAT,
            )}`}</TextComponent>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}>
          <View style={{flex: 7, flexDirection: 'row', alignItems: 'center'}}>
            <TextComponent
              styles={{fontFamily: fontFamilies.bold, fontSize: 15}}>
              Tổng tiền:{' '}
              {`${invoice.amountAfterPromotion}`.replace(MONEY_FORMAT_BY, ',')}
            </TextComponent>
          </View>
          <View
            style={{
              flex: 3,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
            <TextComponent>
              Đã trả: {`${invoice.amountPaid}`.replace(MONEY_FORMAT_BY, ',')}
            </TextComponent>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          <InvoiceStateTag state={invoice.state} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BasicInvoiceCard;
