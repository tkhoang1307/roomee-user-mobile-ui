import React, {useEffect, useState} from 'react';
import {
  View,
  Alert,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import {useTranslation} from 'react-i18next';

import {
  TitleComponent,
  InputComponent,
  ButtonComponent,
  TextComponent,
  SelectValueComponent,
  UploadImageComponent,
} from '@components/index';
import {AddPaymentMethodScreenProps} from '@models/navigators/HomNavigator';
import {appColors} from '@const/appColors';
import {styles} from './styles';
import {paymentService} from '@services';
import {
  BankInformationResponseModel,
  CreatePaymentMethodModel,
} from '@models/payment';
import {ErrorResponseAxios} from '@models/error';
import {PaymentMethodEnum} from '@const/payment';
import {ScrollView} from 'react-native-gesture-handler';
import { IImageUri } from '@models/room';

const AddPaymentMethodScreen: React.FC<AddPaymentMethodScreenProps> = ({
  navigation,
}) => {
  const {t} = useTranslation();
  const [createLoading, setCreateLoading] = useState(false);
  const [method, setMethod] = useState<PaymentMethodEnum>(
    PaymentMethodEnum.BANK,
  );
  const [bankEwalletName, setBankEwalletName] = useState<string>('');
  const [eWalletName, setEWalletName] = useState<string>('');
  const [bankEwalletAccountName, setBankEwalletAccountName] =
    useState<string>('');
  const [bankEwalletAccountNumber, setBankEwalletAccountNumber] =
    useState<string>('');
  const [note, setNote] = useState<string>('');
  const [bankOptions, setBankOptions] = useState<
    BankInformationResponseModel[]
  >([]);
  const [qrCodeImageFiles, setQRCodeImageFiles] = useState<IImageUri[]>([]);

  useEffect(() => {
    const getAllBanks = async () => {
      const dataBanking = await paymentService.getAllBanks();
      const mapperOptions = dataBanking.map((bank: any) => ({
        value: bank.code,
        label: ' (' + bank.shortName.toUpperCase() + ')  ' + bank.name,
      }));
      setBankOptions(mapperOptions);
    };
    getAllBanks();
  }, []);

  const handleAddNewPaymentMethod = async () => {
    setCreateLoading(true);
    try {
      if (!bankEwalletAccountName || !bankEwalletAccountNumber) {
        Alert.alert(t(`alertTitle.noti`), t(`alertContent.fillNotEnough`));
        return;
      }

      const bodyFormData = new FormData();
      bodyFormData.append('file', qrCodeImageFiles[0] as any);
      const payloadQRCode = await paymentService.uploadPaymentQRCode(bodyFormData);

      let payloadSetting;
      if (method === PaymentMethodEnum.BANK) {
        if (!bankEwalletName) {
          Alert.alert(t(`alertTitle.noti`), t(`alertContent.fillNotEnough`));
          return;
        }
        payloadSetting = {
          bankAccountName: bankEwalletAccountName,
          bankAccountNumber: bankEwalletAccountNumber,
          bank: bankEwalletName,
        };
      } else {
        if (!eWalletName) {
          Alert.alert(t(`alertTitle.noti`), t(`alertContent.fillNotEnough`));
          return;
        }
        payloadSetting = {
          phoneNumber: bankEwalletAccountNumber,
          wallet: eWalletName,
          walletAccountName: bankEwalletAccountName,
        };
      }
      const payload: CreatePaymentMethodModel = {
        type: method!,
        note: note,
        settings: payloadSetting,
        qrCodeUrl: payloadQRCode,
      };
      await paymentService.createUserPaymentInfors(payload);
      navigation.goBack();
      setMethod(PaymentMethodEnum.BANK);
      setBankEwalletName('');
      setBankEwalletAccountName('');
      setBankEwalletAccountNumber('');
      setNote('');
    } catch (error: any) {
      Alert.alert(
        t(`alertTitle.noti`),
        (error as ErrorResponseAxios).response.data.message,
      );
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <View style={[styles.container, {position: 'relative'}]}>
      <TitleComponent
        back
        title={t('actions.addPaymentInformation')}
        titleStyle={{fontSize: 20, marginTop: -2}}
      />
      <ScrollView>
        <View style={[styles.containerContent, {position: 'relative'}]}>
          <View style={styles.flexContainer}>
            <TouchableOpacity
              style={[
                styles.card,
                method === PaymentMethodEnum.BANK && {
                  backgroundColor: appColors.primary,
                },
              ]}
              onPress={() => setMethod(PaymentMethodEnum.BANK)}>
              <Image
                source={require('../../../assets/images/Banking.png')}
                style={styles.image}
              />
              <Text
                style={[
                  styles.text,
                  {
                    color:
                      method === PaymentMethodEnum.BANK ? 'black' : undefined,
                  },
                  method === PaymentMethodEnum.BANK && styles.boldText,
                ]}>
                {t('payment.bank.name')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.card,
                method === PaymentMethodEnum.EWALLET && {
                  backgroundColor: appColors.primary,
                },
              ]}
              onPress={() => setMethod(PaymentMethodEnum.EWALLET)}>
              <Image
                source={require('../../../assets/images/Ewallet.png')}
                style={styles.image}
              />
              <Text
                style={[
                  styles.text,
                  {
                    color:
                      method === PaymentMethodEnum.EWALLET
                        ? 'black'
                        : undefined,
                  },
                  method === PaymentMethodEnum.EWALLET && styles.boldText,
                ]}>
                {t('payment.wallet.name')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{}}>
            {method === PaymentMethodEnum.BANK ? (
              <SelectValueComponent
                wallet
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
                value={eWalletName}
                onChange={val => {
                  setEWalletName(val);
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
            <View style={{flexDirection: 'row'}}>
              <TextComponent
                text={t('label.note')}
                styles={{marginBottom: 6}}
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
                value={note}
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

            <View style={{marginTop: 16}}>
              <UploadImageComponent
                listImageUri={qrCodeImageFiles}
                setListImageUri={setQRCodeImageFiles}
                maxImage={1}
                size={100}
              />
            </View>
          </View>
          <ButtonComponent
            loading={createLoading}
            styles={[{marginTop: 24}]}
            text={t('actions.addPaymentInformation')}
            onPress={handleAddNewPaymentMethod}
            type="primary"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default AddPaymentMethodScreen;
