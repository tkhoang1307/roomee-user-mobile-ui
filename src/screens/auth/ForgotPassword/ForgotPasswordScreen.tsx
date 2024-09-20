import {Alert} from 'react-native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
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
import {validateEmail} from '@utils/formValidate';
import {authService} from '@services';

const ForgotPasswordScreen = ({navigation}: any) => {
  const {t} = useTranslation();
  const [email, setEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleCheckEmail = () => {
    if (!validateEmail(email)) {
      setErrorMessage(t('validation.invalidEmail'));
    }
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    if (email === '') {
      setErrorMessage(t('validation.emailRequired'));
      setLoading(false);
      return;
    }

    try {
      await authService.forgotPassword(email);
      navigation.navigate('InputCodeScreen', {email: email});
    } catch (error: any) {
      Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
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
        <TextComponent text={t('authTitle.inputEmailTitle')} />
        <SpaceComponent height={20} />
        <InputComponent
          value={email}
          onChange={val => {
            setEmail(val);
            setErrorMessage('');
          }}
          affix={<IconOutline name="mail" size={20} color={appColors.gray} />}
          placeholder="Roomee@gmail.com"
          onEnd={handleCheckEmail}
          errorMessage={errorMessage}
        />
      </SectionComponent>
      <SectionComponent>
        <ButtonComponent
          onPress={handleForgotPassword}
          text={t('actions.next')}
          type="primary"
          icon={
            <IconOutline name="arrow-right" size={20} color={appColors.white} />
          }
          //  iconFlex="right"
          loading={loading}
        />
      </SectionComponent>
    </ContainerComponent>
  );
};

export default ForgotPasswordScreen;
