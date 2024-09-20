import {useTranslation} from 'react-i18next';
import {fontFamilies} from '@const/fontFamilies';
import {useEffect, useState} from 'react';
import {Dimensions, Image, View} from 'react-native';

import {appColors} from '@const/appColors';
import TextComponent from '@components/TextComponent';
import {
  BankInformationResponseModel,
  BankMethodModel,
  EwalletMethodModel,
  PaymentMethodModel,
} from '@models/payment';
import {PaymentMethodEnum} from '@const/payment';
import RowComponent from '@components/RowComponent';
import {paymentService} from '@services';

interface PaymentMethodCardProps {
  detailPaymentMethod: PaymentMethodModel;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  detailPaymentMethod,
}) => {
  const {t} = useTranslation();
  const type = detailPaymentMethod.type || PaymentMethodEnum.BANK;
  const [listBanks, setListBanks] = useState<BankInformationResponseModel[]>(
    [],
  );

  useEffect(() => {
    const getAllBanks = async () => {
      const resData = await paymentService.getAllBanks();
      const mapperOptions = resData.map((bank: any) => ({
        value: bank.code,
        label: bank.name + ' (' + bank.shortName + ')',
        logo: bank.logo,
      }));
      setListBanks(mapperOptions);
    };
    getAllBanks();
  }, []);

  const convertFromBankCodeToBankName = (bankCode: string): string => {
    const bank = listBanks.find(
      (bank: BankInformationResponseModel) => bank.value === bankCode,
    );
    return bank ? bank.label : bankCode;
  };

  const bankLogo = (bankCode: string) => {
    if (type && type === PaymentMethodEnum.BANK) {
      const bank = listBanks.find(
        (bank: BankInformationResponseModel) => bank.value === bankCode,
      );
      if (bank) {
        return {uri: `${bank.logo}`};
      }
      return require('../../assets/images/Banking.png');
    }
    return require('../../assets/images/Ewallet.png');
  };

  return (
    <View
      style={{
        width: '100%',
        paddingVertical: 8,
        paddingHorizontal: 12,
        rowGap: 1,
        backgroundColor: appColors.white,
      }}>
      <View style={{flexDirection: 'row', columnGap: 16}}>
        {detailPaymentMethod.qrCodeUrl ? (
          <View
            style={{
              backgroundColor: appColors.white,
              borderRadius: 25,
              height: 50,
              width: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 25,
            }}>
            <Image
              source={{uri: detailPaymentMethod.qrCodeUrl}}
              style={{
                width: 60,
                height: 60,
                borderRadius: 5,
                objectFit: 'contain',
              }}
            />
          </View> 
        ) : (
          <View
            style={{
              backgroundColor: appColors.white,
              borderRadius: 25,
              height: 50,
              width: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 25,
            }}>
            <Image
              source={bankLogo(
                (detailPaymentMethod as BankMethodModel).settings.bank || '',
              )}
              style={{
                width: 60,
                height: 60,
                borderRadius: 5,
                objectFit: 'contain',
              }}
            />
          </View> 
        )}
        <View style={{justifyContent: 'space-evenly', flexGrow: 7, rowGap: 4}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}>
            {/* <TextComponent>
              {t(`payment.${type.toLowerCase()}.bankOrEwallet`)}:{' '}
            </TextComponent> */}
            <TextComponent
              styles={{
                fontFamily: fontFamilies.bold,
                width: Dimensions.get('screen').width - 50 - 16 - 24,
              }}
              numberOfLine={3}>
              {type === PaymentMethodEnum.BANK
                ? convertFromBankCodeToBankName(
                    (detailPaymentMethod as BankMethodModel).settings.bank ||
                      '',
                  )
                : (detailPaymentMethod as EwalletMethodModel).settings.wallet ||
                  ''}
            </TextComponent>
          </View>
          <RowComponent
            styles={{
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}>
            {/* <TextComponent>{t('label.accountOwner')}: </TextComponent> */}
            <TextComponent
              styles={{
                fontFamily: fontFamilies.bold,
                width: Dimensions.get('screen').width - 50 - 16 - 24,
              }}>
              {type === PaymentMethodEnum.BANK
                ? (detailPaymentMethod as BankMethodModel).settings
                    .bankAccountName || ''
                : (detailPaymentMethod as EwalletMethodModel).settings
                    .walletAccountName || ''}
            </TextComponent>
          </RowComponent>
          <RowComponent
            styles={{
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}>
            <TextComponent
              styles={{
                fontFamily: fontFamilies.bold,
                fontSize: 20,
                width: Dimensions.get('screen').width - 50 - 16 - 24,
              }}>
              {type === PaymentMethodEnum.BANK
                ? (detailPaymentMethod as BankMethodModel).settings
                    .bankAccountNumber || ''
                : (detailPaymentMethod as EwalletMethodModel).settings
                    .phoneNumber || ''}
            </TextComponent>
          </RowComponent>
          <RowComponent
            styles={{justifyContent: 'flex-start', alignItems: 'flex-start'}}>
            {detailPaymentMethod.note && (
              <TextComponent
                styles={{
                  flexWrap: 'wrap',
                  width: Dimensions.get('screen').width - 50 - 16 - 24,
                }}>
                {t('label.note') + ': '}
                {detailPaymentMethod.note}
              </TextComponent>
            )}
          </RowComponent>
        </View>
      </View>
    </View>
  );
};

export default PaymentMethodCard;
