import TextComponent from '@components/TextComponent';
import {appColors} from '@const/appColors';
import {View} from 'react-native';

const SharpSymbol = () => {
  return (
    <View
      style={{
        height: 40,
        width: 40,
        backgroundColor: appColors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
      }}>
      <TextComponent
        size={22}
        styles={[{color: appColors.backgroundCard, marginTop: -4}]}>
        #
      </TextComponent>
    </View>
  );
};

export default SharpSymbol;
