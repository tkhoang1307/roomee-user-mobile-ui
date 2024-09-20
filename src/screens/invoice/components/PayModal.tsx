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

interface PayModalProps {
  invoiceId: string;
  openPayModal: boolean;
  setOpenPayModal: React.Dispatch<React.SetStateAction<boolean>>;
  setDetailInvoice: React.Dispatch<
    React.SetStateAction<DetailInvoiceResponseModel | undefined>
  >;
}

const PayModal: React.FC<PayModalProps> = ({
  invoiceId,
  openPayModal,
  setOpenPayModal,
  setDetailInvoice,
}) => {
  const {t} = useTranslation();

  const handlePayInvoice = async () => {
    try {
      const res = await invoiceService.paidInvoice(invoiceId);
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
      setOpenPayModal(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      title={t('invoice.confirmPaidInvocieTitle')}
      visible={openPayModal}
      maskClosable
      onClose={() => setOpenPayModal(false)}
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
            typeTag={TagTypeEnum.INFORMATION}
            content={t('invoice.confirmPaidInvoiceDesc')}
          />
        </View>
      </View>
    </Modal>
  );
};

export default PayModal;
