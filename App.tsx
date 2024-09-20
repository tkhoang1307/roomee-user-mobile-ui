import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Host} from 'react-native-portalize';
import {NavigationContainer} from '@react-navigation/native';
import moment from 'moment-timezone';

import Compose from './src/stores';
import {AuthProvider} from './src/stores/provider/authProvider';
import AppRouters from './src/navigations/AppRouters';
import './src/i18n';
import {GlobalConfigProvider} from './src/stores/provider/globalConfigProvider';
import {UserProvider} from './src/stores/provider/userProvider';
import {AbilityProvider} from './src/stores/provider/abilityProvider';
import {AccommodationsProvider} from './src/stores/provider/accommodationsProvider';
import {CurAccomProvider} from './src/stores/provider/curAccomProvider';
import {NotiProvider} from './src/stores/provider/notiProvider';
import {RequestsProvider} from './src/stores/provider/requestsProvider';
import {MainAccomProvider} from './src/stores/provider/mainAccommodationProvider';

moment.tz.setDefault('Asia/Ho_Chi_Minh');

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Compose
        components={[
          AuthProvider,
          GlobalConfigProvider,
          UserProvider,
          AbilityProvider,
          AccommodationsProvider,
          CurAccomProvider,
          NotiProvider,
          RequestsProvider,
          MainAccomProvider,
        ]}>
        <Host>
          <NavigationContainer>
            <AppRouters />
          </NavigationContainer>
        </Host>
      </Compose>
    </GestureHandlerRootView>
  );
};

export default App;
