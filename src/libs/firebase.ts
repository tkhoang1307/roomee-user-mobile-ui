import {PermissionsAndroid} from 'react-native';
import messaging from '@react-native-firebase/messaging';

export function requestAndroidPermission() {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
}

export const registerBackgroundHandler = () => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
};

export const requestForToken = () => {
  return messaging()
    .getToken()
    .then(currentToken => {
      if (currentToken) {
        console.log('current token for client: ', currentToken);
        return currentToken;
      }
      console.log(
        'No registration token available. Request permission to generate one.',
      );
      return null;
    })
    .catch(err => {
      console.log('An error occurred while retrieving token. ', err);
    });
};
