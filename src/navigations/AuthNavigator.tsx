import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ForgotPasswordScreen from '@screens/auth/ForgotPassword/ForgotPasswordScreen';
import InputCodeScreen from '@screens/auth/ForgotPassword/screens/InputCodeScreen';
import InputNewPasswordScreen from '@screens/auth/ForgotPassword/screens/InputNewPasswordScreen';
import LoginScreen from '@screens/auth/Login/LoginScreen';
import SignUpScreen from '@screens/auth/SignUp/SignUpScreen';

const AuthNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
      />
      <Stack.Screen name="InputCodeScreen" component={InputCodeScreen} />
      <Stack.Screen
        name="InputNewPasswordScreen"
        component={InputNewPasswordScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
