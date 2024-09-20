import {Text, StyleProp, TextStyle, Platform} from 'react-native';
import React from 'react';
import {appColors} from '@const/appColors';
import {fontFamilies} from '@const/fontFamilies';

interface Props {
  text?: string;
  color?: string;
  size?: number;
  flex?: number;
  styles?: StyleProp<TextStyle>;
  title?: boolean;
  font?: string;
  numberOfLine?: number;
  children?: React.ReactNode;
}

const TextUnitComponent = (props: Props) => {
  const {text, size, flex, color, styles, title, font, numberOfLine, children} =
    props;

  const fontSizeDefault = Platform.OS === 'android' ? 14 : 16;

  return (
    <Text
      numberOfLines={numberOfLine}
      style={[
        {
          color: color ?? appColors.text,
          flex: flex ?? 0,
          fontSize: size ? size : title ? 24 : fontSizeDefault,
          fontFamily: font ? font : fontFamilies.regular,
        },
        styles,
      ]}>
      {text}
      {children}
    </Text>
  );
};

export default TextUnitComponent;
