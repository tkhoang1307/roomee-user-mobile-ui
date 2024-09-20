import axios, {InternalAxiosRequestConfig} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {AuthEndPoints} from '@const/auth';
import {getNextExpiresTime, isTokenStillValid} from '@utils/expiresTime';
import {Alert} from 'react-native';
import {event} from './event';

console.log('Base url: ', process.env.BASE_URL);

const getRefreshToken = async (refreshToken: string, deviceId: string) => {
  const getLang = await AsyncStorage.getItem('locale');
  const res = await axios.post(
    `${process.env.BASE_URL}` + `${AuthEndPoints.REFRESH_TOKEN_ENDPOINT}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        'device-id': deviceId || '',
        lang: getLang || 'vi',
      },
    },
  );
  return res.data;
};

const privateAxios = axios.create({
  baseURL: process.env.BASE_URL,
});
privateAxios.interceptors.request.use(
  async (config: InternalAxiosRequestConfig<any>) => {
    let token = await AsyncStorage.getItem('token');
    let device = await AsyncStorage.getItem('device');
    let lang = (await AsyncStorage.getItem('locale')) || 'vi';
    config.headers['lang'] = lang;

    if (token && device) {
      let {accessToken, refreshToken, expiresTime} = JSON.parse(token);
      let {deviceId} = JSON.parse(device);
      if (!isTokenStillValid(expiresTime)) {
        const newToken = await getRefreshToken(refreshToken, deviceId);
        accessToken = newToken.accessToken;
        AsyncStorage.setItem(
          'token',
          JSON.stringify({
            accessToken,
            refreshToken: newToken.refreshToken,
            expiresTime: getNextExpiresTime(newToken.expiresIn),
          }),
        );
      }

      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      return config;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  },
);

privateAxios.interceptors.response.use(
  res => {
    return res;
  },
  async err => {
    if (err.response) {
      if (err.response.status === 401) {
        console.log('error message', err.response.status);
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('token');
        event.emit('LOGOUT');
        return;
      }
      if (err.response.status === 403) {
        await AsyncStorage.removeItem('device');
        await AsyncStorage.removeItem('token');
        event.emit('LOGOUT');
      }
    } else {
      const lang = (await AsyncStorage.getItem('locale')) || 'vi';
      const _noti =
        lang === 'vi'
          ? 'Server đang tạm mất kết nối, vui lòng thử lại sau!'
          : 'Server lost connection, retry later!';
      Alert.alert('Thông báo', _noti);
      return null;
    }
    return Promise.reject(err);
  },
);

const publicAxios = axios.create({
  baseURL: process.env.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    //  lang: AsyncStorage.getItem('locale') || 'vi',
    // lang: 'vi',
  },
});

export {privateAxios, publicAxios};
