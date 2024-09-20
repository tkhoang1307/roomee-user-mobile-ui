import {IconOutline} from '@ant-design/icons-react-native';
import React, {useContext, useEffect, useState} from 'react';
import {Alert, Image, ScrollView, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {
  ContainerComponent,
  InputComponent,
  TextComponent,
  SectionComponent,
  SpaceComponent,
  RowComponent,
  RadioButtonComponent,
} from '@components/index';
import {AuthContext, GlobalConfigContext, UserContext} from '@context';
import {AuthConst, UserConst} from '@const/index';
import {loginStyles} from './styles';
import ButtonComponent from '@components/ButtonComponent';
import {authService} from '@services';
import {appColors} from '@const/appColors';
import DropdownLanguageComponent from './components/DropdownLanguageComponent';
import {globalStyles} from '@styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  GetTokensResponse,
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const LoginScreen = ({navigation}: any) => {
  const {t} = useTranslation();
  const {languageMode} = useContext(GlobalConfigContext);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>();
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>();
  const [loadingLogin, setLoadingLogin] = useState(false);
  const {authDispatch} = useContext(AuthContext);
  const {userDispatch} = useContext(UserContext);
  const [ggToken, setGgToken] = useState('');
  const [role, setRole] = useState('');
  const [loadingLoginByGoogle, setLoadingLoginByGoogle] = useState(false);

  const signIn = async () => {
    let tokenGoogle: GetTokensResponse = {idToken: '', accessToken: ''};
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      const tokenGoogle = await GoogleSignin.getTokens();
      const data = await authService.signinByGoogle({
        accessToken: tokenGoogle.accessToken || '',
      });
      const {user} = data;
      const payload = {
        ...data,
      };
      authDispatch({type: AuthConst.LOGIN, payload: {...payload}});
      userDispatch({type: UserConst.EDIT_PROFILE, payload: {...user}});
    } catch (error: any) {
      if (error?.response?.data?.error === 'not_existed_user') {
        setGgToken(tokenGoogle?.accessToken || '');
      }
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            // user cancelled the login flow
            break;
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // play services not available or outdated
            break;
          default:
          // some other error happened
        }
      } else {
        Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
          {
            text: t('actions.cancel'),
            style: 'cancel',
          },
        ]);
      }
    }
  };

  const handleSubmitRole = async () => {
    try {
      setLoadingLoginByGoogle(true);
      const data = await authService.signupByGoogle({
        role: role,
        accessToken: ggToken,
      });
      const {user} = data;
      const payload = {
        ...data,
      };
      authDispatch({type: AuthConst.LOGIN, payload: {...payload}});
      userDispatch({type: UserConst.EDIT_PROFILE, payload: {...user}});
    } catch (error: any) {
      Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
        {
          text: t('actions.cancel'),
          style: 'cancel',
        },
      ]);
    } finally {
      setLoadingLoginByGoogle(false);
    }
  };

  useEffect(() => {
    if (emailErrorMessage) {
      setEmailErrorMessage(t('validation.emailRequired'));
    }

    if (passwordErrorMessage) {
      setPasswordErrorMessage(t('validation.passwordRequired'));
    }
  }, [languageMode]);

  const options = [
    {value: 'OWNER', label: t('accountDetail.role.owner')},
    {value: 'TENANT', label: t('accountDetail.role.tenant')},
  ];

  const handleValueChangeRadioButton = (value: string) => {
    setRole(value);
  };

  const handleLogin = async () => {
    setLoadingLogin(true);
    if (email.trim() === '') {
      let emailError = t('validation.emailRequired');
      setEmailErrorMessage(emailError);
    }
    if (password.trim() === '') {
      let passwordError = t('validation.passwordRequired');
      setPasswordErrorMessage(passwordError);
      setLoadingLogin(false);
      return;
    }

    const payloadSignin = {
      username: email,
      password: password,
    };
    try {
      const data = await authService.signin(payloadSignin);
      const {user} = data;
      const payload = {
        ...data,
      };
      authDispatch({type: AuthConst.LOGIN, payload: {...payload}});
      userDispatch({type: UserConst.EDIT_PROFILE, payload: {...user}});
    } catch (error: any) {
      Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
        {
          text: t('actions.cancel'),
          style: 'cancel',
        },
      ]);
    } finally {
      setLoadingLogin(false);
    }
  };

  const handleGoback = () => {
    setGgToken('');
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '417577262500-mf89mcpkah6f8da8pnj3q4icfetp903n.apps.googleusercontent.com',
      offlineAccess: true,
    });
    GoogleSignin.signOut();
  }, []);

  return (
    <ContainerComponent isImageBackground>
      {/* <View style={{position: 'relative'}}> */}
      {/* <SectionComponent styles={{marginTop: 10}}> */}
      <DropdownLanguageComponent />
      {/* </SectionComponent> */}

      <SectionComponent styles={{flex: 1}}>
        {/* Email and password*/}
        <View style={{flex: 5}}>
          <ScrollView>
            <SectionComponent styles={[loginStyles.sectionLogo]}>
              {/* Image */}
              <Image
                source={require('../../../assets/images/logo-2.png')}
                style={loginStyles.logo}
              />
            </SectionComponent>
            <TextComponent size={28} title text={t('authTitle.loginTitle')} />
            <SpaceComponent height={20} />
            {ggToken.length > 0 ? (
              <View style={{gap: 20}}>
                <TextComponent>{t('descriptions.chooseRole')}</TextComponent>
                <View style={{justifyContent: 'center'}}>
                  <RadioButtonComponent
                    options={options}
                    onValueChange={handleValueChangeRadioButton}
                    initialValue="OWNER"
                    // errorMessage={errorMessages.role}
                    style={{justifyContent: 'center', gap: 30}}
                  />
                </View>
                <ButtonComponent
                  styles={{width: 200}}
                  text={t('actions.continue')}
                  type="primary"
                  onPress={handleSubmitRole}
                  loading={loadingLoginByGoogle}
                />
                <ButtonComponent
                  styles={{
                    alignSelf: 'center',
                  }}
                  text={t('actions.goBack')}
                  type="link"
                  onPress={handleGoback}
                />
              </View>
            ) : (
              <>
                <InputComponent
                  value={email}
                  placeholder={t('placeholders.email')}
                  onChange={val => {
                    setEmail(val);
                    setEmailErrorMessage('');
                  }}
                  allowClear
                  affix={
                    <IconOutline name="mail" size={22} color={appColors.gray} />
                  }
                  errorMessage={emailErrorMessage}
                />

                <InputComponent
                  value={password}
                  placeholder={t('placeholders.password')}
                  onChange={val => {
                    setPassword(val);
                    setPasswordErrorMessage('');
                  }}
                  isPassword
                  allowClear
                  affix={
                    <IconOutline name="lock" size={22} color={appColors.gray} />
                  }
                  errorMessage={passwordErrorMessage}
                />
                <RowComponent styles={{justifyContent: 'flex-end'}}>
                  <ButtonComponent
                    text={t('authTitle.forgotPassword')}
                    onPress={() => navigation.navigate('ForgotPasswordScreen')}
                    type="link"
                  />
                </RowComponent>

                <RowComponent styles={{justifyContent: 'center', marginTop: 8}}>
                  <TextComponent>{t('label.or')}</TextComponent>
                </RowComponent>
                <RowComponent styles={{justifyContent: 'center', marginTop: 8}}>
                  <TouchableOpacity
                    style={globalStyles.iconButton}
                    onPress={() => signIn()}>
                    <Icon name="google" color="#EA4335" size={20} />
                  </TouchableOpacity>
                </RowComponent>
              </>
            )}
          </ScrollView>
        </View>
        <View style={{minHeight: 80}}>
          <ButtonComponent
            styles={{marginTop: 10}}
            onPress={handleLogin}
            text={t('actions.signIn')}
            type="primary"
            loading={loadingLogin}
          />
          <RowComponent justify="center" styles={{marginTop: 5}}>
            <TextComponent text={`${t('authTitle.noAccount')} `} />
            <ButtonComponent
              type="link"
              text={t('authTitle.signUpTitle')}
              onPress={() => navigation.navigate('SignUpScreen')}
            />
          </RowComponent>
        </View>
      </SectionComponent>
      {/* </View> */}
    </ContainerComponent>
  );
};

export default LoginScreen;
