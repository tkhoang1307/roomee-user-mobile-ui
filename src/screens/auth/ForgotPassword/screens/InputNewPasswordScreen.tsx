import {Alert, ToastAndroid} from 'react-native';
import React, {useState} from 'react';
import {IconOutline} from '@ant-design/icons-react-native';

import {
  ButtonComponent,
  ContainerComponent,
  InputComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '@components/index';
import {appColors} from '@const/appColors';
import {validatePassword} from '@utils/formValidate';
import {authService} from '@services';
import {ErrorsRenewPassword, ValueFormRenewPasswordModel} from '@models/auth';
import {useTranslation} from 'react-i18next';

const initValue = {
  password: '',
  confirmPassword: '',
};

const InputNewPasswordScreen = ({navigation}: any) => {
  const {t} = useTranslation();
  const [values, setValues] = useState<ValueFormRenewPasswordModel>(initValue);
  const [errorMessage, setErrorMessage] =
    useState<ErrorsRenewPassword>(initValue);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChangeValue = (
    key: keyof ValueFormRenewPasswordModel,
    value: string,
  ) => {
    setValues(prevValues => ({
      ...prevValues,
      [key]: value,
    }));
    setErrorMessage(prevValues => ({
      ...prevValues,
      [key]: '',
    }));

    if (key === 'confirmPassword') {
      setErrorMessage(prevErrorMessages => ({
        ...prevErrorMessages,
        confirmPassword:
          value !== values.password ? t('validation.confirmPasswordError') : '',
      }));
    }
  };

  const formValidator = (key: keyof ErrorsRenewPassword) => {
    setErrorMessage(prevErrorMessages => {
      const newErrorMessages = {...prevErrorMessages};

      switch (key) {
        case 'password':
          newErrorMessages.password = validatePassword(values.password)
            ? ''
            : t('validation.weakPassword');
          break;
      }

      return newErrorMessages;
    });
  };

  const handleRenewPassword = async () => {
    try {
      setLoading(true);
      const newErrorMessages: ErrorsRenewPassword = {...errorMessage};
      let hasError = false;
      Object.entries(values).forEach(([key, value]) => {
        if (!value) {
          switch (key) {
            case 'password':
              newErrorMessages.password = t('validation.passwordRequired');
              break;
            case 'confirmPassword':
              newErrorMessages.confirmPassword = t(
                'validation.confirmPasswordRequired',
              );
              break;
          }
          hasError = true;
        }
      });

      if (hasError) {
        setErrorMessage(newErrorMessages);
        setLoading(false);
        return;
      }
      await authService.renewForgotPassword(values.password);
      ToastAndroid.showWithGravity(
        'Đã cập nhật lại password!',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      navigation.navigate('LoginScreen');
    } catch (error: any) {
      Alert.alert('Thông báo', error?.response?.data.message, [
        {
          text: 'Xác nhận',
          style: 'cancel',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContainerComponent back isImageBackground isScroll>
      <SectionComponent>
        <TextComponent text={t('authTitle.forgotPassword')} title />
        <SpaceComponent height={12} />
        <TextComponent text={t('authTitle.inputNewPassword')} />
        <SpaceComponent height={20} />
        <InputComponent
          value={values.password}
          placeholder={t('placeholders.password')}
          onChange={val => handleChangeValue('password', val)}
          isPassword
          allowClear
          affix={<IconOutline name="lock" size={22} color={appColors.gray} />}
          onEnd={() => formValidator('password')}
          errorMessage={errorMessage.password}
        />
        <InputComponent
          value={values.confirmPassword}
          placeholder={t('placeholders.confirmPassword')}
          onChange={val => handleChangeValue('confirmPassword', val)}
          isPassword
          allowClear
          affix={<IconOutline name="lock" size={22} color={appColors.gray} />}
          // onEnd={() => formValidator('confirmPassword')}
          errorMessage={errorMessage.confirmPassword}
        />
      </SectionComponent>
      <SectionComponent>
        <ButtonComponent
          onPress={handleRenewPassword}
          text={t('actions.send')}
          type="primary"
          loading={loading}
        />
      </SectionComponent>
    </ContainerComponent>
  );
};

export default InputNewPasswordScreen;
