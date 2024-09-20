import React, {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {UserContext} from '@context';
import VerifyAccountScreen from '@screens/auth/VerifyAccount/VerifyAccountScreen';
import TabNavigator from './TabNavigator';

const MainNavigator = () => {
  const {userState} = useContext(UserContext);
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {userState.emailVerified ? (
        <Stack.Screen name="Main" component={TabNavigator} />
      ) : (
        <Stack.Screen name="verify" component={VerifyAccountScreen} />
      )}
    </Stack.Navigator>
  );
};

export default MainNavigator;
