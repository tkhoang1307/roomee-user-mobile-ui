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

const IdentityCardImage = (props: Props) => {
  const {imageUrl, name, size, styles, onPress} = props;

  return (
    <TouchableOpacity disabled={!onPress} onPress={onPress}>
      {imageUrl ? (
        <Image
          source={{uri: imageUrl}}
          style={[
            {
              aspectRatio: 16 / 9,
              height: size ?? 40,
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
              aspectRatio: 16 / 9,
              height: size ?? 40,
              borderWidth: 1,
              borderColor: appColors.white,
              backgroundColor: appColors.gray2,
            },
          ]}>
          <TextComponent
            text={name}
            color={appColors.text}
            size={size ? size / 8 : 14}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default IdentityCardImage;
