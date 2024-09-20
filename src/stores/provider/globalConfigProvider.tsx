import {Provider} from '@ant-design/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import enUS from '@ant-design/react-native/lib/locale-provider/en_US';
import customTheme from '../../theme/customTheme';

import React, {createContext, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';

// const initializedLocale = await AsyncStorage.getItem('locale')
let initializedLocale = 'vi';
// const getLanguage = async () => {
//   initializedLocale = (await AsyncStorage.getItem('locale')) || 'vi';
// };
// getLanguage();

const GlobalConfigContext = createContext<{
  languageMode: {
    changeLanguageMode: (newLocale: string) => void;
    locale: string;
  };
}>({
  languageMode: {
    changeLanguageMode: () => {},
    locale: initializedLocale,
  },
});

function GlobalConfigProvider({children}: {children?: React.ReactNode}) {
  const {i18n} = useTranslation();
  const [locale, setLocale] = useState(initializedLocale);

  const storeLocale = async (newLocale: string) => {
    await AsyncStorage.setItem('locale', newLocale);
  };

  const languageMode = useMemo(
    () => ({
      changeLanguageMode: (newLocale: string) => {
        setLocale(() => {
          // const newLocale = prevLocale === 'en' ? 'vi' : 'en';
          i18n.changeLanguage(newLocale);
          storeLocale(newLocale);
          return newLocale;
        });
      },
      locale: locale,
    }),
    [locale],
  );
  useEffect(() => {
    i18n.changeLanguage(locale);
  }, []);
  return (
    <GlobalConfigContext.Provider value={{languageMode}}>
      <Provider theme={customTheme} locale={enUS}>
        {children}
      </Provider>
    </GlobalConfigContext.Provider>
  );
}

export {GlobalConfigContext, GlobalConfigProvider};
