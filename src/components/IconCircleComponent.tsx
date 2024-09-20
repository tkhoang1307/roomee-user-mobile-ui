import {View, StyleProp, ViewStyle} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {appColors} from '@const/appColors';

interface Props {
  colorCircle?: string;
  sizeCircle?: number;
  colorIcon?: string;
  sizeIcon?: number;
  styles?: StyleProp<ViewStyle>;
  name: string;
}

const IconCircleComponent: React.FC<Props> = ({
  colorCircle,
  sizeCircle,
  colorIcon,
  sizeIcon,
  styles,
  name,
}) => {
  const localStyle: StyleProp<ViewStyle> = {
    width: sizeCircle ?? 60,
    height: sizeCircle ?? 60,
    backgroundColor: colorCircle ?? appColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  };

  return (
    <View style={[localStyle, styles]}>
      <Icon
        name={name}
        size={sizeIcon ?? 30}
        color={colorIcon ? colorIcon : appColors.white}
      />
    </View>
  );
};

export default IconCircleComponent;
