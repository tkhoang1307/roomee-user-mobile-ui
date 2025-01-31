import moment from 'moment';
import {useTranslation} from 'react-i18next';
import {fontFamilies} from '@const/fontFamilies';
// import {useState} from 'react';
// import {Button, Modal} from '@ant-design/react-native';
import {TouchableOpacity, View} from 'react-native';
import {RootStackParamList} from '@models/navigators/HomNavigator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

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

interface InvoiceCardProps {
  editable?: boolean;
  navigation?: NativeStackNavigationProp<
    RootStackParamList,
    'ListInvoicesScreen',
    undefined
  >;
  invoice: InvoiceModel;
  accommodationId: string;
  roomId: string;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({
  navigation,
  invoice,
  accommodationId,
  roomId,
}) => {
  const {t} = useTranslation();
  //   const [openMenu, setOpenMenu] = useState(false);

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

            {/* menu button */}
            {/* <TouchableOpacity
              style={globalStyles.iconButton}
              onPress={() => setOpenMenu(true)}>
              <Icon name="dots-vertical" size={20} />
            </TouchableOpacity> */}
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

      {/* menu */}
      {/* <Modal
        popup
        visible={openMenu}
        maskClosable
        animationType="slide-up"
        onClose={() => setOpenMenu(false)}>
        <View>
          {invoice.state === 'DRAFT' ? (
            <Button
              style={globalStyles.menuPopupButton}
              onPress={() => {
                setOpenMenu(false);
                navigation?.navigate('EditInvoiceScreen', {
                  invoiceId: invoice.id,
                  roomId: roomId || '',
                  accommodationId: accommodationId,
                });
              }}>
              {t('actions.editInvoice')}
            </Button>
          ) : (
            <Button
              style={globalStyles.menuPopupButton}
              onPress={() => {
                setOpenMenu(false);
                navigation?.navigate('DetailInvoiceScreen', {
                  invoiceId: invoice.id,
                  accommodationId: accommodationId,
                  roomId: roomId,
                });
              }}>
              {t('label.detailInvoice')}
            </Button>
          )}
        </View>
        <Button
          type="primary"
          style={globalStyles.closePopupButton}
          onPress={() => setOpenMenu(false)}>
          {t('actions.close')}
        </Button>
      </Modal> */}
    </TouchableOpacity>
  );
};

export default InvoiceCard;
