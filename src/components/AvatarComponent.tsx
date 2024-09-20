import React from 'react';
import {
  Image,
  ImageProps,
  StyleProp,
  TouchableOpacity,
  View,
} from 'react-native';

import {TextComponent} from '.';
import {appColors} from '@const/appColors';
import {globalStyles} from '@styles';

interface Props {
  imageUrl?: string;
  name: string;
  size?: number;
  styles?: StyleProp<ImageProps>;
  onPress?: () => void;
}

const AvatarComponent = (props: Props) => {
  const {imageUrl, name, size, styles, onPress} = props;

  return (
    <TouchableOpacity disabled={!onPress} onPress={onPress}>
      {imageUrl ? (
        <Image
          source={{uri: imageUrl}}
          style={[
            {
              width: size ?? 40,
              height: size ?? 40,
              borderRadius: 100,
              borderWidth: 1,
              borderColor: appColors.gray4,
            },
            styles,
          ]}
        />
      ) : (
        <View
          style={[
            globalStyles.center,
            {
              width: size ?? 40,
              height: size ?? 40,
              borderRadius: 100,
              borderWidth: 1,
              borderColor: appColors.white,
              backgroundColor: appColors.gray2,
            },
          ]}>
          <TextComponent
            text={name.substring(0, 1).toLocaleUpperCase()}
            color={appColors.text}
            size={size ? size / 3 : 14}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default AvatarComponent;
