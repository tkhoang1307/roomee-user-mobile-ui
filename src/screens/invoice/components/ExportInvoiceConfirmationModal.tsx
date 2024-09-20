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

interface ExportInvoiceConfirmationModalProps {
  invoiceId: string;
  roomId: string;
  accommodationId: string;
  modalOpenExport: boolean;
  setModalOpenExport: React.Dispatch<React.SetStateAction<boolean>>;
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'EditInvoiceScreen',
    undefined
  >;
}

const ExportInvoiceConfirmationModal: React.FC<
  ExportInvoiceConfirmationModalProps
> = ({invoiceId, modalOpenExport, setModalOpenExport, navigation}) => {
  const {t} = useTranslation();

  const handleExportInvoice = async () => {
    try {
      await invoiceService.exportInvoiceById(invoiceId || '');
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
      setModalOpenExport(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalOpenExport}
      maskClosable
      onClose={() => setModalOpenExport(false)}
      footer={[
        {
          text: t('actions.cancel'),
          onPress: () => {},
          style: {color: appColors.danger},
        },
        {
          text: t('actions.exportInvoice'),
          onPress: () => handleExportInvoice(),
          style: {color: appColors.primary},
        },
      ]}>
      <View style={{width: '100%'}}>
        <TextComponent size={18}>
          {t('descriptions.exportInvoice')}
        </TextComponent>
      </View>
    </Modal>
  );
};

export default ExportInvoiceConfirmationModal;
