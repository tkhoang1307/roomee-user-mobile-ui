import {View, Alert} from 'react-native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Modal} from '@ant-design/react-native';

import {invoiceService} from '@services';
import {InputComponent, TextComponent} from '@components/index';
import {appColors} from '@const/appColors';
import {ErrorResponseAxios} from '@models/error';
import {DetailInvoiceResponseModel} from '@models/invoices';
import InformationTag from '@components/InformationTag';
import {MONEY_FORMAT_BY, TagTypeEnum} from '@const/index';

interface PartialPaidModalProps {
  invoiceId: string;
  openPartialPaidModal: boolean;
  setOpenPartialPaidModal: React.Dispatch<React.SetStateAction<boolean>>;
  detailInvoice: DetailInvoiceResponseModel | undefined;
  setDetailInvoice: React.Dispatch<
    React.SetStateAction<DetailInvoiceResponseModel | undefined>
  >;
}

const PartialPaidModal: React.FC<PartialPaidModalProps> = ({
  invoiceId,
  openPartialPaidModal,
  setOpenPartialPaidModal,
  detailInvoice,
  setDetailInvoice,
}) => {
  const {t} = useTranslation();
  const [amount, setAmount] = useState<string>('');
  const {amountPaid = 0, amountAfterPromotion = 0} = detailInvoice ?? {};
  const [validation, setValidation] = useState<string>('');

  const handlePartialPaidInvoice = async () => {
    try {
      if (!amount) {
        Alert.alert(t(`alertTitle.noti`), t(`alertContent.fillNotEnough`));
        return;
      }
      if (parseInt(amount) + amountPaid > amountAfterPromotion) {
        Alert.alert(t(`alertTitle.noti`), t('invoice.partialPaidFail'));
        return;
      }
      const res = await invoiceService.partialPaidInvoice(invoiceId, {
        currentPaid: parseInt(amount),
      });
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
      setOpenPartialPaidModal(false);
    }
  };

  const handleChangeAmount = (value: string) => {
    let amountValue = 0;
    if (value) {
      amountValue = parseInt(value);
    }

    if (amountValue + amountPaid > amountAfterPromotion) {
      setValidation(t('invoice.partialPaidFail'));
    } else {
      setValidation('');
    }

    setAmount(value);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      title={t('invoice.confirmPartialPaidInvoiceTitle')}
      visible={openPartialPaidModal}
      onClose={() => setOpenPartialPaidModal(false)}
      maskClosable
      footer={[
        {
          text: t('actions.cancel'),
          onPress: () => {},
          style: {color: appColors.danger},
        },
        {
          text: t('actions.submit'),
          onPress: () => handlePartialPaidInvoice(),
          style: {color: appColors.primary},
        },
      ]}>
      <View style={{width: '100%'}}>
        <View style={{marginTop: 24, marginBottom: 8}}>
          <InformationTag
            typeTag={TagTypeEnum.INFORMATION}
            content={t('invoice.confirmPartialPaidInvoiceDesc', {
              amount: amountAfterPromotion
                ? `${amountAfterPromotion}`.replace(MONEY_FORMAT_BY, ',')
                : 0,
              paid: `${
                (amountPaid ? amountPaid : 0) + (amount ? parseInt(amount) : 0)
              }`.replace(MONEY_FORMAT_BY, ','),
            })}
          />
        </View>
        <View style={{marginTop: 8}}>
          <View style={{width: '100%'}}>
            <TextComponent text={t('invoice.confirmPartialPaidPlaceHolder')} />
          </View>
          <View style={{width: '100%'}}>
            <InputComponent
              value={amount}
              placeholder="100,000"
              onChange={val => {
                handleChangeAmount(val);
              }}
              type="numeric"
            />
          </View>
          <View style={{width: '100%', marginTop: -16}}>
            <TextComponent
              text={validation}
              styles={[{color: appColors.danger}]}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PartialPaidModal;
