import {Text, Alert, ToastAndroid} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

import {
  ButtonComponent,
  ContainerComponent,
  OTPInput,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '@components/index';
import {appColors} from '@const/appColors';
import {authService} from '@services';
import {COUNTING_TIME} from '@const/user';

const InputCodeScreen = ({navigation, route}: any) => {
  const {t} = useTranslation();
  const {email} = route.params;
  const [codeValues, setCodeValues] = useState<string[]>(['', '', '', '']);

  const [counter, setCounter] = useState<number>(COUNTING_TIME);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    if (counter > 0) {
      const interval = setInterval(() => {
        setCounter(counter => counter - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [counter]);

  const handleResendVerification = async () => {
    setCounter(COUNTING_TIME);
    try {
      await authService.forgotPassword(email);
      ToastAndroid.showWithGravity(
        t('success.resendEmail'),
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } catch (error: any) {
      Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
        {
          text: 'Xác nhận',
          // onPress: () => Alert.alert('Cancel Pressed'),
          style: 'cancel',
        },
      ]);
    }
  };

  const handleVerification = async () => {
    setIsLoading(true);
    const isEmptyElementPresent = codeValues.some(value => value === '');
    if (isEmptyElementPresent) {
      setErrorMessage(t('validation.codeRequired'));
      setIsLoading(false);
      return;
    }
    let codeInput = '';

    codeValues.forEach(val => (codeInput += val));
    try {
      await authService.verifyCodeForgotPassword(email, parseInt(codeInput));
      navigation.navigate('InputNewPasswordScreen');
    } catch (error: any) {
      Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
        {
          text: 'Xác nhận',
          // onPress: () => Alert.alert('Cancel Pressed'),
          style: 'cancel',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const submitOTP = async () => {
      const allElementsNotEmpty = codeValues.every(value => value !== '');
      if (!allElementsNotEmpty) {
        return;
      }
      setIsLoading(true);
      try {
        let item = '';
        codeValues.forEach(val => (item += val));
        await authService.verifyCodeForgotPassword(email, parseInt(item));
        navigation.navigate('InputNewPasswordScreen');
      } catch (error: any) {
        Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
          {
            text: 'Xác nhận',
            style: 'cancel',
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    submitOTP();
  }, [codeValues]);

  return (
    <ContainerComponent back isImageBackground isScroll>
      <SectionComponent>
        <TextComponent text={t('authTitle.forgotPassword')} title />
        <SpaceComponent height={12} />
        <TextComponent text={t('placeholders.inputCode', {email: email})} />
        <SpaceComponent height={26} />

        <RowComponent justify="space-around">
          <OTPInput
            length={4}
            disabled={false}
            value={codeValues}
            onChange={values => {
              setCodeValues(values);
              setErrorMessage('');
            }}
          />
        </RowComponent>
      </SectionComponent>
      {errorMessage ? (
        <SectionComponent>
          <TextComponent
            styles={{textAlign: 'center'}}
            text={errorMessage}
            color={appColors.danger}
          />
        </SectionComponent>
      ) : (
        <SectionComponent>
          <Text></Text>
        </SectionComponent>
      )}

      <SectionComponent styles={{marginTop: 10}}>
        <ButtonComponent
          onPress={handleVerification}
          text={t('actions.verify')}
          type="primary"
          loading={isLoading}
        />
      </SectionComponent>

      <SectionComponent>
        {counter > 0 ? (
          <RowComponent justify="center">
            <TextComponent
              text={t('actions.resendEmail', {seconds: counter})}
            />
          </RowComponent>
        ) : (
          <RowComponent>
            <ButtonComponent
              type="link"
              text={t('authTitle.resendCode')}
              onPress={handleResendVerification}
            />
          </RowComponent>
        )}
      </SectionComponent>
    </ContainerComponent>
  );
};

export default InputCodeScreen;
