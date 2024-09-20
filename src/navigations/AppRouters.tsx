import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useContext, useEffect, useState} from 'react';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import SplashScreen from '@screens/SplashScreen';
import {AuthContext, GlobalConfigContext, UserContext} from '@context';
import {AuthConst, UserConst} from '@const/index';
import {event} from '@libs/event';
import {Alert} from 'react-native';
import {useTranslation} from 'react-i18next';

const AppRouters = () => {
  const {t} = useTranslation();
  const [isShowSplash, setIsShowSplash] = useState(true);
  const {authState, authDispatch} = useContext(AuthContext);
  const {userDispatch} = useContext(UserContext);
  const {languageMode} = useContext(GlobalConfigContext);

  const checkLogin = async () => {
    const token = await AsyncStorage.getItem('token');
    const device = await AsyncStorage.getItem('device');
    token &&
      device &&
      authDispatch({
        type: AuthConst.LOGIN,
        payload: {token: JSON.parse(token), device: JSON.parse(device)},
      });
  };

  const getUserInStorage = async () => {
    const userStorage = await AsyncStorage.getItem('user');

    userStorage &&
      userDispatch({
        type: UserConst.EDIT_PROFILE,
        payload: {...JSON.parse(userStorage)},
      });
  };

  const getLocaleStorage = async () => {
    const localeStorage = await AsyncStorage.getItem('locale');
    localeStorage && languageMode.changeLanguageMode(localeStorage);
  };

  useEffect(() => {
    const listener = event.addListener('LOGOUT', () => {
      // Alert.alert(t('alertTitle.noti'), t('label.sessionExpired'), [
      //   {
      //     text: t('actions.cancel'),
      //     style: 'cancel',
      //   },
      // ]);
      authDispatch({
        type: AuthConst.LOG_OUT,
      });
    });

    return () => {
      listener.remove();
    };
  }, []);
  useEffect(() => {
    checkLogin();
    getUserInStorage();
    getLocaleStorage();
    const timeout = setTimeout(() => {
      setIsShowSplash(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {isShowSplash ? (
        <SplashScreen />
      ) : authState.token.accessToken ? (
        <MainNavigator />
      ) : (
        <AuthNavigator />
      )}
    </>
  );
};

export default AppRouters;
