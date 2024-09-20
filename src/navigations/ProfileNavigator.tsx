import {appColors} from '@const/appColors';
import {ProfileStackParamList} from '@models/navigators/ProfileNavigator';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DetailLanguageScreen from '@screens/language/DetailLanguage/DetailLanguageScreen';
import ProfileScreen from '@screens/profile/ProfileScreen';
import CreateIdentityCardScreen from '@screens/profile/screens/CreateIdentityCardScreen';
import EditProfileScreen from '@screens/profile/screens/EditProfileScreen';
import ListIdentityCardScreen from '@screens/profile/screens/ListIdentityCardScreen';
import React from 'react';
import {Platform} from 'react-native';

const ProfileNavigator = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const Stack = createNativeStackNavigator<ProfileStackParamList>();
  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === 'ListIdentityCardScreen') {
      navigation.setOptions({tabBarStyle: {display: 'none'}});
      return;
    }
    if (routeName === 'CreateIdentityCardScreen') {
      navigation.setOptions({tabBarStyle: {display: 'none'}});
      return;
    }
    if (routeName === 'EditProfileScreen') {
      navigation.setOptions({tabBarStyle: {display: 'none'}});
      return;
    }
    if (routeName === 'DetailLanguageScreen') {
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
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen
        name="CreateIdentityCardScreen"
        component={CreateIdentityCardScreen}
      />
      <Stack.Screen
        name="ListIdentityCardScreen"
        component={ListIdentityCardScreen}
      />
      <Stack.Screen
        name="DetailLanguageScreen"
        component={DetailLanguageScreen}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
