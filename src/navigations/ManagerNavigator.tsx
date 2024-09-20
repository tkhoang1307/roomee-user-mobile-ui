import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import ListManagerScreen from '@screens/manager/ListManagerScreen/ListManagerScreen';
import CreateManagerAccountScreen from '@screens/manager/CreateManagerAccountScreen/CreateManagerAccountScreen';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {RootStackParamList} from '@models/navigators/HomNavigator';
import {Platform} from 'react-native';
import {appColors} from '@const/appColors';
import ChangeInfoAccommodationScreen from '@screens/accommodation/DetailAccommodation/screens/ChangeInfoAccommodationScreen';
import AllRoomScreen from '@screens/room/AllRoom/AllRoomScreen';
import ListRulesScreen from '@screens/rule/ListRulesScreen/ListRulesScreen';
import ServiceAccommodationScreen from '@screens/service-utility/ListServiceAccommodation/ServiceAccommodationScreen';
import DetailRoomScreen from '@screens/room/DetailRoom/DetailRoomScreen';
import AddRoomScreen from '@screens/room/AddRoom/AddRoomScreen';
import CreateContractScreen from '@screens/contract/CreateContract/CreateContractScreen';
import EditRoomScreen from '@screens/room/EditRoom/EditRoomScreen';
import ListTenantScreen from '@screens/tenant/ListTenantScreen/ListTenantScreen';
import ListInvoicesScreen from '@screens/invoice/ListInvoicesScreen/ListInvoicesScreen';
import ListInvoicesOfAccommodationScreen from '@screens/invoice/ListInvoicesOfAccommodationScreen/ListInvoicesOfAccommodationScreen';
import AddTenantScreen from '@screens/room/AddTenant/AddTenantScreen';
import AddTenantIdCardScreen from '@screens/room/AddTenantIdCard/AddTenantIdCardScreen';
import DetailInvoiceScreen from '@screens/invoice/DetailInvoiceScreen/DetailInvoiceScreen';
import ServiceContractScreen from '@screens/service-utility/ListServiceContract/ServiceContractScreen';
import CreateInvoiceScreen from '@screens/invoice/CreateInvoiceScreen/CreateInvoiceScreen';
import EditInvoiceScreen from '@screens/invoice/EditInvoiceScreen/EditInvoiceScreen';
import ManageListPaymentMethodScreen from '@screens/payment-method/ManageListPaymentMethodScreen/ManageListPaymentMethodScreen';
import AddPaymentMethodScreen from '@screens/payment-method/AddPaymentMethodScreen/AddPaymentMethodScreen';
import ReportScreen from '@screens/accommodation/Report/ReportScreen';
import RoomRequestsScreen from '@screens/request/RoomRequestsScreen/RoomRequestsScreen';
import DetailRequestScreen from '@screens/request/DetailRequestScreen/DetailRequestScreen';
import AccomRequestsScreen from '@screens/accommodation/Request/AccomRequestsScreen';
import DetailContractScreen from '@screens/contract/DetailContractScreen/DetailContractScreen';
import AccomContractsScreen from '@screens/accommodation/ContractsScreen/AccomContractsScreen';
import AddAccommodationScreen from '@screens/accommodation/AddAccommodation/AddAccommodationScreen';
import DetailMainAccommodationScreen from '@screens/accommodation/DetailAccommodation/DetailMainAccommodation';

const ManagerNavigator = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === 'ChangeInfoAccommodationScreen') {
      navigation.setOptions({tabBarStyle: {display: 'none'}});
      return;
    }
    // if (routeName === 'DetailRoomScreen') {
    //   navigation.setOptions({tabBarStyle: {display: 'none'}});
    //   return;
    // }
    if (routeName === 'CreateContractScreen') {
      navigation.setOptions({tabBarStyle: {display: 'none'}});
      return;
    }

    if (routeName === 'AddRoomScreen') {
      navigation.setOptions({tabBarStyle: {display: 'none'}});
      return;
    }
    if (routeName === 'EditRoomScreen') {
      navigation.setOptions({tabBarStyle: {display: 'none'}});
      return;
    }
    if (routeName === 'AddTenantScreen') {
      navigation.setOptions({tabBarStyle: {display: 'none'}});
      return;
    }
    if (routeName === 'AddTenantIdCardScreen') {
      navigation.setOptions({tabBarStyle: {display: 'none'}});
      return;
    }
    if (routeName === 'DetailRequestScreen') {
      navigation.setOptions({tabBarStyle: {display: 'none'}});
      return;
    }
    if (routeName === 'ListManagerScreen') {
      navigation.setOptions({tabBarStyle: {display: 'none'}});
      return;
    }
    if (routeName === 'CreateManagerAccountScreen') {
      navigation.setOptions({tabBarStyle: {display: 'none'}});
      return;
    }
    if (routeName === 'AddAccommodationScreen') {
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
      <Stack.Screen
        name="DetailMainAccommodationScreen"
        component={DetailMainAccommodationScreen}
      />
      <Stack.Screen
        name="ChangeInfoAccommodationScreen"
        component={ChangeInfoAccommodationScreen}
      />
      <Stack.Screen name="AllRoomScreen" component={AllRoomScreen} />
      <Stack.Screen
        name="ServiceAccommodationScreen"
        component={ServiceAccommodationScreen}
      />
      <Stack.Screen name="ListRulesScreen" component={ListRulesScreen} />
      <Stack.Screen name="DetailRoomScreen" component={DetailRoomScreen} />
      <Stack.Screen name="AddRoomScreen" component={AddRoomScreen} />
      <Stack.Screen
        name="CreateContractScreen"
        component={CreateContractScreen}
      />
      <Stack.Screen name="EditRoomScreen" component={EditRoomScreen} />
      <Stack.Screen name="ListTenantScreen" component={ListTenantScreen} />
      <Stack.Screen name="ListInvoicesScreen" component={ListInvoicesScreen} />
      <Stack.Screen
        name="ListInvoicesOfAccommodationScreen"
        component={ListInvoicesOfAccommodationScreen}
      />
      <Stack.Screen name="AddTenantScreen" component={AddTenantScreen} />
      <Stack.Screen
        name="AddTenantIdCardScreen"
        component={AddTenantIdCardScreen}
      />
      <Stack.Screen
        name="DetailInvoiceScreen"
        component={DetailInvoiceScreen}
      />
      <Stack.Screen
        name="ServiceContractScreen"
        component={ServiceContractScreen}
      />
      <Stack.Screen
        name="CreateInvoiceScreen"
        component={CreateInvoiceScreen}
      />
      <Stack.Screen name="EditInvoiceScreen" component={EditInvoiceScreen} />
      <Stack.Screen
        name="ManageListPaymentMethodScreen"
        component={ManageListPaymentMethodScreen}
      />
      <Stack.Screen
        name="AddPaymentMethodScreen"
        component={AddPaymentMethodScreen}
      />
      <Stack.Screen name="ReportScreen" component={ReportScreen} />
      <Stack.Screen name="RoomRequestsScreen" component={RoomRequestsScreen} />
      <Stack.Screen
        name="DetailRequestScreen"
        component={DetailRequestScreen}
      />
      <Stack.Screen
        name="AccomRequestsScreen"
        component={AccomRequestsScreen}
      />
      <Stack.Screen
        name="DetailContractScreen"
        component={DetailContractScreen}
      />
      <Stack.Screen
        name="AccomContractsScreen"
        component={AccomContractsScreen}
      />
      <Stack.Screen name="ListManagerScreen" component={ListManagerScreen} />
      <Stack.Screen
        name="CreateManagerAccountScreen"
        component={CreateManagerAccountScreen}
      />
      <Stack.Screen
        name="AddAccommodationScreen"
        component={AddAccommodationScreen}
      />
    </Stack.Navigator>
  );
};

export default ManagerNavigator;
