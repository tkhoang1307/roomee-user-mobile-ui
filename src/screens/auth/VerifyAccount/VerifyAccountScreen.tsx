import {Text, Alert, ToastAndroid} from 'react-native';
import {useTranslation} from 'react-i18next';
import React, {useContext, useEffect, useState} from 'react';

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
import {AuthContext, UserContext} from '@context';
import {AuthConst, UserConst} from '@const/index';

const VerifyAccountScreen = () => {
  const {t} = useTranslation();
  const {authDispatch} = useContext(AuthContext);
  const {userState, userDispatch} = useContext(UserContext);
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

  const handleReturn = async () => {
    authDispatch({type: AuthConst.LOG_OUT});
    userDispatch({type: UserConst.LOG_OUT});
  };

  const handleResendVerification = async () => {
    setCounter(COUNTING_TIME);
    try {
      await authService.resendVerifyEmail();
      ToastAndroid.showWithGravity(
        t('authTitle.resendCodeSuccess'),
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } catch (error: any) {
      Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
        {
          text: t('actions.cancel'),
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
      const data = await authService.verifyEmail(parseInt(codeInput));
      const {user} = data;
      const payload = {
        ...data,
      };
      authDispatch({type: AuthConst.LOGIN, payload: {...payload}});
      userDispatch({type: UserConst.EDIT_PROFILE, payload: {...user}});
      // navigation.navigate('InputNewPasswordScreen');
    } catch (error: any) {
      Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
        {
          text: t('actions.cancel'),
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
        let codeInput = '';
        codeValues.forEach(val => (codeInput += val));
        const data = await authService.verifyEmail(parseInt(codeInput));
        const {user} = data;
        const payload = {
          ...data,
        };
        authDispatch({type: AuthConst.LOGIN, payload: {...payload}});
        userDispatch({type: UserConst.EDIT_PROFILE, payload: {...user}});
        //   navigation.navigate('InputNewPasswordScreen');
      } catch (error: any) {
        Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
          {
            text: t('actions.cancel'),
            // onPress: () => Alert.alert('Cancel Pressed'),
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
    <ContainerComponent isImageBackground isScroll>
      <SpaceComponent height={50} />
      <SectionComponent>
        <TextComponent text={t('authTitle.verifyAccount')} title />
        <SpaceComponent height={12} />
        <TextComponent
          text={t('placeholders.inputCode', {email: userState.username})}
        />
        <SpaceComponent height={12} />
        <TextComponent text={t('descriptions.verifyDescription')} />
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
          text={t('actions.ok')}
          type="primary"
          loading={isLoading}
        />
      </SectionComponent>

      <SectionComponent>
        {counter > 0 ? (
          <RowComponent justify="center">
            <TextComponent text={t('authTitle.resendCodeIn')} flex={0} />
            <TextComponent
              text={`${(counter - (counter % 60)) / 60}:${
                counter - (counter - (counter % 60))
              }`}
              flex={0}
              color={appColors.link}
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
      <SectionComponent styles={{marginTop: 10}}>
        <RowComponent justify="center">
          <ButtonComponent
            onPress={handleReturn}
            text={t('authTitle.returnLogin')}
            type="link"
            loading={isLoading}
          />
        </RowComponent>
      </SectionComponent>
    </ContainerComponent>
  );
};

export default VerifyAccountScreen;
