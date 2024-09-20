import {appColors} from '@const/appColors';
import {View} from 'react-native';

export default function Divider() {
  return (
    <View
      style={{
        height: 6,
        backgroundColor: appColors.primary,
        width: '35%',
        borderRadius: 8,
        marginTop: 8,
        marginBottom: 4,
      }}
    />
  );
}
