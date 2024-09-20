import {appColors} from '@const/appColors';
import {ActivityIndicator, View} from 'react-native';

const ListLoadingMask = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        height: '100%',
      }}>
      <ActivityIndicator size={30} color={appColors.primary} />
    </View>
  );
};

export default ListLoadingMask;
