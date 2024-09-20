import React, {useContext, useState} from 'react';
import {IconOutline} from '@ant-design/icons-react-native';
import {useTranslation} from 'react-i18next';
import {Alert, ScrollView, View} from 'react-native';

import {
  ButtonComponent,
  ContainerComponent,
  InputComponent,
  RadioButtonComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '@components/index';
import {appColors} from '@const/appColors';
import {ErrorsMessageModel, ValueFormSignUpModel} from '@models/auth';
import {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
} from '@utils/formValidate';
import {authService} from '@services';
import {AuthContext, UserContext} from '@context';
import {AuthConst, UserConst} from '@const/index';

const initErrorMessage = {
  username: '',
  password: '',
  phoneNumber: '',
  fullname: '',
  confirmPassword: '',
  role: '',
};

const initValue = {
  fullname: '',
  phoneNumber: '',
  username: '',
  password: '',
  confirmPassword: '',
};

const SignUpScreen = ({navigation}: any) => {
  const {t} = useTranslation();
  const {authDispatch} = useContext(AuthContext);
  const {userDispatch} = useContext(UserContext);
  const [values, setValues] = useState<ValueFormSignUpModel>(initValue);
  const [loadingSignUp, setLoadingSignUp] = useState(false);
  const [role, setRole] = useState<string>('');
  const [errorMessages, setErrorMessages] =
    useState<ErrorsMessageModel>(initErrorMessage);
  const options = [
    {value: 'OWNER', label: t('accountDetail.role.owner')},
    {value: 'TENANT', label: t('accountDetail.role.tenant')},
  ];
  const handleChangeValue = (
    key: keyof ValueFormSignUpModel,
    value: string,
  ) => {
    setValues(prevValues => ({
      ...prevValues,
      [key]: value,
    }));
    setErrorMessages(prevValues => ({
      ...prevValues,
      [key]: '',
    }));

    if (key === 'confirmPassword') {
      setErrorMessages(prevErrorMessages => ({
        ...prevErrorMessages,
        confirmPassword:
          value !== values.password ? t('validation.confirmPasswordError') : '',
      }));
    }
  };

  const formValidator = (key: keyof ErrorsMessageModel) => {
    setErrorMessages(prevErrorMessages => {
      const newErrorMessages = {...prevErrorMessages};

      switch (key) {
        case 'username':
          newErrorMessages.username = validateEmail(values.username)
            ? ''
            : t('validation.invalidEmail');
          break;
        case 'password':
          newErrorMessages.password = validatePassword(values.password)
            ? ''
            : t('validation.weakPassword');
          break;
        case 'phoneNumber':
          newErrorMessages.phoneNumber = validatePhoneNumber(values.phoneNumber)
            ? ''
            : t('validation.invalidPhone');
          break;
      }

      return newErrorMessages;
    });
  };
  const handleRegister = async () => {
    setLoadingSignUp(true);
    const newErrorMessages: ErrorsMessageModel = {...errorMessages};
    let hasError = false;

    if (role === '') {
      newErrorMessages.role = t('validation.roleRequired');
      hasError = true;
    }

    Object.entries(values).forEach(([key, value]) => {
      if (!value) {
        switch (key) {
          case 'phoneNumber':
            newErrorMessages.phoneNumber = t('validation.telephoneRequired');
            break;
          case 'username':
            newErrorMessages.username = t('validation.emailRequired');
            break;
          case 'fullname':
            newErrorMessages.fullname = t('validation.nameRequired');
            break;
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
      setErrorMessages(newErrorMessages);
      setLoadingSignUp(false);
      return;
    }

    const payload = {
      username: values.username,
      password: values.password,
      phoneNumber: values.phoneNumber,
      name: values.fullname,
      role,
    };

    try {
      const data = await authService.signup(payload);
      const {user} = data;
      const payloadAuthDispatch = {
        ...data,
      };
      authDispatch({type: AuthConst.LOGIN, payload: {...payloadAuthDispatch}});
      userDispatch({type: UserConst.EDIT_PROFILE, payload: {...user}});
    } catch (error: any) {
      Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
        {
          text: t('actions.cancel'),
          // onPress: () => Alert.alert('Cancel Pressed'),
          style: 'cancel',
        },
      ]);
    } finally {
      setLoadingSignUp(false);
    }
  };

  const handleValueChangeRadioButton = (value: string) => {
    setRole(value);
    setErrorMessages(prev => {
      return {...prev, role: ''};
    });
  };

  return (
    <>
      <ContainerComponent isImageBackground back>
        <SectionComponent>
          <TextComponent size={24} title text={t('authTitle.signUpTitle')} />
        </SectionComponent>
        <SectionComponent styles={{flex: 1}}>
          <View style={{flex: 3}}>
            <ScrollView>
              <RadioButtonComponent
                options={options}
                onValueChange={handleValueChangeRadioButton}
                initialValue=""
                errorMessage={errorMessages.role}
              />

              <InputComponent
                type="numeric"
                value={values.phoneNumber}
                placeholder={t('placeholders.phoneNumber')}
                onChange={(val: string) =>
                  handleChangeValue('phoneNumber', val)
                }
                allowClear
                affix={
                  <IconOutline name="phone" size={22} color={appColors.gray} />
                }
                onEnd={() => formValidator('phoneNumber')}
                errorMessage={errorMessages.phoneNumber}
              />

              <InputComponent
                value={values.username}
                placeholder="Roomee@gmail.com"
                onChange={val => handleChangeValue('username', val)}
                allowClear
                affix={
                  <IconOutline name="mail" size={22} color={appColors.gray} />
                }
                onEnd={() => formValidator('username')}
                errorMessage={errorMessages.username}
              />

              <InputComponent
                value={values.fullname}
                placeholder={t('placeholders.fullName')}
                onChange={val => handleChangeValue('fullname', val)}
                allowClear
                affix={
                  <IconOutline name="user" size={22} color={appColors.gray} />
                }
                errorMessage={errorMessages.fullname}
              />

              <InputComponent
                value={values.password}
                placeholder={t('placeholders.password')}
                onChange={val => handleChangeValue('password', val)}
                isPassword
                allowClear
                affix={
                  <IconOutline name="lock" size={22} color={appColors.gray} />
                }
                onEnd={() => formValidator('password')}
                errorMessage={errorMessages.password}
              />
              <InputComponent
                value={values.confirmPassword}
                placeholder={t('placeholders.confirmPassword')}
                onChange={val => handleChangeValue('confirmPassword', val)}
                isPassword
                allowClear
                affix={
                  <IconOutline name="lock" size={22} color={appColors.gray} />
                }
                // onEnd={() => formValidator('confirmPassword')}
                errorMessage={errorMessages.confirmPassword}
              />
              <SpaceComponent height={20} />
            </ScrollView>
          </View>

          {/* <SpaceComponent height={16} /> */}
          <View style={{flex: 1}}>
            <ButtonComponent
              styles={{marginTop: 30}}
              onPress={handleRegister}
              text={t('actions.signUp')}
              type="primary"
              loading={loadingSignUp}
            />
            <SpaceComponent height={10} />
            <RowComponent justify="center">
              <TextComponent text={t('authTitle.haveAccount') + ' '} />
              <ButtonComponent
                type="link"
                text={t('actions.signIn')}
                onPress={() => navigation.navigate('LoginScreen')}
              />
            </RowComponent>
          </View>
        </SectionComponent>
      </ContainerComponent>
    </>
  );
};

export default SignUpScreen;
