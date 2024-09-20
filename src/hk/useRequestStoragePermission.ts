import {PermissionsAndroid} from 'react-native';

const useRequestStoragePermission = () => {
  const isGranted = async () => {
    return await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
  };

  const requestStoragePermission = async () => {
    try {
      // First, check if the permission is already granted

      if (await isGranted()) {
        console.log('Storage permission already granted');
      } else {
        console.log('Storage permission not granted, requesting permission...');
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Roomee Storage Permission',
            message: 'Roomee App needs access to your storage',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        console.log(granted);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the storage');
        } else {
          console.log('Storage permission denied');
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return {requestStoragePermission, isGranted};
};

export default useRequestStoragePermission;
