import {View, Alert} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Modal} from '@ant-design/react-native';

import {invoiceService} from '@services';
import {appColors} from '@const/appColors';
import {ErrorResponseAxios} from '@models/error';
import InformationTag from '@components/InformationTag';
import {TagTypeEnum} from '@const/index';
import {DetailInvoiceResponseModel} from '@models/invoices';

interface RevokePayModalProps {
  invoiceId: string;
  openRevokePayModal: boolean;
  setOpenRevokePayModal: React.Dispatch<React.SetStateAction<boolean>>;
  setDetailInvoice: React.Dispatch<
    React.SetStateAction<DetailInvoiceResponseModel | undefined>
  >;
}

const RevokePayModal: React.FC<RevokePayModalProps> = ({
  invoiceId,
  openRevokePayModal,
  setOpenRevokePayModal,
  setDetailInvoice,
}) => {
  const {t} = useTranslation();

  const handlePayInvoice = async () => {
    try {
      const res = await invoiceService.revokeInvoice(invoiceId);
      setDetailInvoice(prev => {
        if (prev) {
          return {
            ...prev,
            state: res.state,
            amountPaid: res.amountPaid,
          };
        }
        return prev;
      });
    } catch (error: any) {
      Alert.alert(
        t(`alertTitle.noti`),
        (error as ErrorResponseAxios).response.data.message,
      );
    } finally {
      setOpenRevokePayModal(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      title={t('invoice.confirmRevokeInvocieTitle')}
      visible={openRevokePayModal}
      maskClosable
      onClose={() => setOpenRevokePayModal(false)}
      footer={[
        {
          text: t('actions.cancel'),
          onPress: () => {},
          style: {color: appColors.danger},
        },
        {
          text: t('actions.submit'),
          onPress: () => handlePayInvoice(),
          style: {color: appColors.primary},
        },
      ]}>
      <View style={{width: '100%'}}>
        <View style={{marginTop: 8, marginBottom: 8}}>
          <InformationTag
            typeTag={TagTypeEnum.WARNING}
            content={t('invoice.confirmRevokeInvoiceDesc')}
          />
        </View>
      </View>
    </Modal>
  );
};

export default RevokePayModal;
