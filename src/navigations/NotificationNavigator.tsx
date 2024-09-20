import {appColors} from '@const/appColors';
import {NotificationStackParamList} from '@models/navigators/NotificationNavigator';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DetailContractScreen from '@screens/contract/DetailContractScreen/DetailContractScreen';
import DetailInvoiceScreen from '@screens/invoice/DetailInvoiceScreen/DetailInvoiceScreen';
import NotificationScreen from '@screens/notification/NotificationScreen';
import DetailRequestScreen from '@screens/request/DetailRequestScreen/DetailRequestScreen';
import AddTenantScreen from '@screens/room/AddTenant/AddTenantScreen';
import React from 'react';
import {Platform} from 'react-native';

const NotificationNavigator = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const Stack = createNativeStackNavigator<NotificationStackParamList>();

  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === 'DetailRequestScreen') {
      navigation.setOptions({tabBarStyle: {display: 'none'}});
      return;
    }
    navigation.setOptions({
      tabBarStyle: {
        display: 'flex',
        height: Platform.OS === 'android' ? 70 : 88,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: appColors.white,
      },
    });
  }, [navigation, route]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen
        name="DetailRequestScreen"
        component={DetailRequestScreen}
      />
      <Stack.Screen
        name="DetailContractScreen"
        component={DetailContractScreen}
      />
      <Stack.Screen
        name="DetailInvoiceScreen"
        component={DetailInvoiceScreen}
      />
      <Stack.Screen name="AddTenantScreen" component={AddTenantScreen} />
    </Stack.Navigator>
  );
};

export default NotificationNavigator;
