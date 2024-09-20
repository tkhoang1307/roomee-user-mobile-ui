import {View, Alert} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Modal} from '@ant-design/react-native';

import {invoiceService} from '@services';
import {TextComponent} from '@components/index';
import {appColors} from '@const/appColors';
import {ErrorResponseAxios} from '@models/error';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '@models/navigators/HomNavigator';

interface RemoveInvoiceConfirmationModalProps {
  invoiceId: string;
  roomId: string;
  accommodationId: string;
  modalOpenRemove: boolean;
  setModalOpenRemove: React.Dispatch<React.SetStateAction<boolean>>;
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'EditInvoiceScreen',
    undefined
  >;
}

const RemoveInvoiceConfirmationModal: React.FC<
  RemoveInvoiceConfirmationModalProps
> = ({invoiceId, modalOpenRemove, setModalOpenRemove, navigation}) => {
  const {t} = useTranslation();

  const handleRemoveInvoice = async () => {
    try {
      await invoiceService.deleteInvoiceById(invoiceId || '');
      // navigation?.navigate('ListInvoicesScreen', {
      //   roomId: roomId,
      //   accommodationId: accommodationId,
      // });
      navigation.goBack();
    } catch (error: any) {
      Alert.alert(
        t(`alertTitle.noti`),
        (error as ErrorResponseAxios).response.data.message,
      );
    } finally {
      setModalOpenRemove(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalOpenRemove}
      maskClosable
      onClose={() => setModalOpenRemove(false)}
      footer={[
        {
          text: t('actions.cancel'),
          onPress: () => {},
          style: {color: appColors.danger},
        },
        {
          text: t('actions.delete'),
          onPress: () => handleRemoveInvoice(),
          style: {color: appColors.primary},
        },
      ]}>
      <View style={{width: '100%'}}>
        <TextComponent size={18}>
          {t('descriptions.deleteInvoice')}
        </TextComponent>
      </View>
    </Modal>
  );
};

export default RemoveInvoiceConfirmationModal;
