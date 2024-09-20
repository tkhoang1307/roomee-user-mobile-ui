import AsyncStorage from '@react-native-async-storage/async-storage';

export const setStorage = async (storeName: string, token: any) => {
  await AsyncStorage.setItem(storeName, JSON.stringify(token));
};

export const removeStorage = async (name: string) => {
  await AsyncStorage.removeItem(name);
};

export const getStorage = async (name: string) => {
  const data = await AsyncStorage.getItem(name);
  return data;
};
