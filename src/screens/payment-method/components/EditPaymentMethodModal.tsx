import { View, Alert, TextInput } from 'react-native';
import React, { useEffect, useState, MutableRefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@ant-design/react-native';
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import { IHandles } from 'react-native-modalize/lib/options';

import InputComponent from '@components/InputComponent';
import { paymentService } from '@services';
import { SelectValueComponent, TextComponent, UploadImageComponent } from '@components/index';
import { appColors } from '@const/appColors';
import { styles } from '../styles';
import {
  BankInformationResponseModel,
  PaymentMethodModel,
  UpdatePaymentMethodModel,
} from '@models/payment';
import { PaymentMethodEnum } from '@const/payment';
import { ErrorResponseAxios } from '@models/error';
import { IImageUri } from '@models/room';
import { globalStyles } from '@styles';

interface EditPaymentMethodModalProps {
  selectedPaymentMethod: PaymentMethodModel;
  setListPaymentMethods: React.Dispatch<
    React.SetStateAction<PaymentMethodModel[]>
  >;
  modalizeRef: MutableRefObject<IHandles | undefined>;
}

const EditPaymentMethodModal: React.FC<EditPaymentMethodModalProps> = ({
  selectedPaymentMethod,
  setListPaymentMethods,
  modalizeRef
}) => {
  const { t } = useTranslation();
  const method = selectedPaymentMethod.type;
  const [bankEwalletName, setBankEwalletName] = useState<string>('');
  const [bankEwalletAccountName, setBankEwalletAccountName] =
    useState<string>('');
  const [bankEwalletAccountNumber, setBankEwalletAccountNumber] =
    useState<string>('');
  const [note, setNote] = useState<string>('');
  const [bankOptions, setBankOptions] = useState<
    BankInformationResponseModel[]
  >([]);
  const [qrCodeImageFiles, setQRCodeImageFiles] = useState<IImageUri[]>([]);
  const [createLoading, setCreateLoading] = useState<boolean>(false);

  useEffect(() => {
    const getAllBanks = async () => {
      const dataBanking = await paymentService.getAllBanks();
      const mapperOptions = dataBanking.map((bank: any) => ({
        value: bank.code,
        label: bank.name + ' (' + bank.shortName + ')',
      }));
      setBankOptions(mapperOptions);
    };

    if (method === PaymentMethodEnum.BANK) {
      getAllBanks();
      setBankEwalletName(selectedPaymentMethod.settings.bank);
      setBankEwalletAccountNumber(
        selectedPaymentMethod.settings.bankAccountNumber,
      );
      setBankEwalletAccountName(selectedPaymentMethod.settings.bankAccountName);
      setNote(selectedPaymentMethod.note || '');
      setQRCodeImageFiles([
        {
          uid: '-1',
          name: 'qrCodeImage.png',
          uri: selectedPaymentMethod.qrCodeUrl || ''
        },
      ]);
    } else {
      setBankEwalletName(selectedPaymentMethod.settings.wallet);
      setBankEwalletAccountNumber(selectedPaymentMethod.settings.phoneNumber);
      setBankEwalletAccountName(
        selectedPaymentMethod.settings.walletAccountName,
      );
      setNote(selectedPaymentMethod.note || '');
      setQRCodeImageFiles([
        {
          uid: '-1',
          name: 'qrCodeImage.png',
          uri: selectedPaymentMethod.qrCodeUrl || ''
        },
      ]);
    }
  }, [selectedPaymentMethod, modalizeRef]);

  const resetState = () => {
    setBankEwalletName('');
    setBankEwalletAccountName('');
    setBankEwalletAccountNumber('');
    setNote('');
    setQRCodeImageFiles([]);
  }

  const handleEditPaymentMethod = async () => {
    try {
      setCreateLoading(true);
      if (
        !bankEwalletName ||
        !bankEwalletAccountName ||
        !bankEwalletAccountNumber
      ) {
        Alert.alert(t(`alertTitle.noti`), t(`alertContent.fillNotEnough`));
        return;
      }

      const bodyFormData = new FormData();
      let payloadQRCode = selectedPaymentMethod.qrCodeUrl;
      if (qrCodeImageFiles[0].uid !== '-1') {
        bodyFormData.append('file', qrCodeImageFiles[0] as any);
        payloadQRCode = await paymentService.uploadPaymentQRCode(bodyFormData);
      }

      let payloadSetting;
      if (method === PaymentMethodEnum.BANK) {
        payloadSetting = {
          bankAccountName: bankEwalletAccountName,
          bankAccountNumber: bankEwalletAccountNumber,
          bank: bankEwalletName,
        };
      } else {
        payloadSetting = {
          phoneNumber: bankEwalletAccountNumber,
          wallet: bankEwalletName,
          walletAccountName: bankEwalletAccountName,
        };
      }

      const payload: UpdatePaymentMethodModel = {
        type: method,
        note: note,
        settings: payloadSetting,
        qrCodeUrl: payloadQRCode ? payloadQRCode : undefined,
      };

      const resDataPaymentMethod = await paymentService.editUserPaymentInfor(
        payload,
        selectedPaymentMethod.id,
      );
      if (resDataPaymentMethod !== undefined || resDataPaymentMethod !== null) {
        setListPaymentMethods(prevs =>
          prevs.map(p => {
            if (p.id !== selectedPaymentMethod.id) return p;
            return {
              id: selectedPaymentMethod.id,
              ...payload,
            };
          }),
        );
      }
    } catch (error: any) {
      Alert.alert(
        t(`alertTitle.noti`),
        (error as ErrorResponseAxios).response.data.message,
      );
    } finally {
      modalizeRef.current?.close();
      setCreateLoading(false);
    }
  };

  return (
    <Portal>
      <Modalize
        adjustToContentHeight
        ref={modalizeRef}
        handlePosition="outside"
        onOpen={() => {

        }}
        onClose={() => {
          resetState();
        }}
      >
        <View style={styles.portalContainerStyle}>
          <TextComponent
            text={t('label.editPaymentInfor')}
            styles={{ marginBottom: 10 }}
          />

          <View>
            <View style={{}}>
              {method === PaymentMethodEnum.BANK ? (
                <SelectValueComponent
                  title={t('payment.bank.bank')}
                  data={bankOptions}
                  setValue={setBankEwalletName}
                  setId={setBankEwalletName}
                  value={bankEwalletName}
                  require={true}
                />
              ) : (
                <InputComponent
                  label={t('payment.wallet.wallet')}
                  value={bankEwalletName}
                  onChange={val => {
                    setBankEwalletName(val);
                  }}
                  require={true}
                />
              )}
            </View>
            <View style={{}}>
              <InputComponent
                label={
                  method === PaymentMethodEnum.BANK
                    ? t('payment.bank.bankAccountNumber')
                    : t('payment.wallet.phoneNumber')
                }
                value={bankEwalletAccountNumber}
                onChange={val => {
                  setBankEwalletAccountNumber(val);
                }}
                require={true}
              />
            </View>
            <View style={{}}>
              <InputComponent
                label={
                  method === PaymentMethodEnum.BANK
                    ? t('payment.bank.bankAccountName')
                    : t('payment.bank.bankAccountName')
                }
                value={bankEwalletAccountName}
                onChange={val => {
                  setBankEwalletAccountName(val);
                }}
                require={true}
              />
            </View>
            <View>
              <View style={{ flexDirection: 'row' }}>
                <TextComponent
                  text={t('label.note')}
                  styles={{ marginBottom: 6 }}
                />
              </View>
              <View style={[styles.textAreaContainer]}>
                <TextInput
                  style={styles.textArea}
                  underlineColorAndroid="transparent"
                  placeholder={t('label.note')}
                  placeholderTextColor={appColors.gray4}
                  numberOfLines={10}
                  multiline={true}
                  value={note || ''}
                  onChangeText={val => {
                    setNote(val);
                  }}
                />
              </View>
            </View>
            <View>
              <View style={{flexDirection: 'row'}}>
                <TextComponent
                  text={t('invoiceItem.uploadImage')}
                  styles={[{marginBottom: -8, marginTop: 8}]}
                />
              </View>

              <View style={{marginTop: 24}}>
                <UploadImageComponent
                  listImageUri={qrCodeImageFiles}
                  setListImageUri={setQRCodeImageFiles}
                  maxImage={1}
                  size={100}
                />
              </View>
            </View>
          </View>
        </View>
        <Button
          type="primary"
          style={globalStyles.closePopupButton}
          onPress={() => handleEditPaymentMethod()}
          loading={createLoading}
        >
          {t('actions.edit')}
        </Button>
      </Modalize>
    </Portal>
  );
};

export default EditPaymentMethodModal;
