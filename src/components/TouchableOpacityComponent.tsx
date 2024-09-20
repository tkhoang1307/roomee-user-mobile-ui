import {
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {ReactNode} from 'react';

import {TextComponent} from '.';
import {appColors} from '@const/appColors';

interface Props {
  icon?: ReactNode;
  text: string;
  type?: 'primary' | 'text' | 'link' | 'action';
  color?: string;
  styles?: StyleProp<ViewStyle>;
  textColor?: string;
  textStyles?: StyleProp<TextStyle>;
  onPress?: () => void;
  iconFlex?: 'right' | 'left';
  disable?: boolean;
  loading?: boolean;
  iconAction?: ReactNode;
}

const TouchableOpacityComponent = (props: Props) => {
  const {
    icon,
    text,
    textColor,
    textStyles,
    color,
    styles,
    onPress,
    iconFlex,
    type,
    disable,
    loading,
    iconAction,
  } = props;

  return type === 'primary' ? (
    <View style={{alignItems: 'center'}}>
      <TouchableOpacity
        disabled={disable || loading}
        onPress={onPress}
        style={[
          {
            backgroundColor: color
              ? color
              : disable
              ? appColors.gray4
              : loading
              ? appColors.primaryLight
              : appColors.primary,
            width: '100%',
          },
          styles,
        ]}>
        {icon && iconFlex === 'left' && icon}
        {loading ? (
          <ActivityIndicator color={appColors.white} style={{marginRight: 8}} />
        ) : null}
        <TextComponent
          text={text}
          color={textColor ?? appColors.white}
          styles={[
            textStyles,
            {
              marginLeft: icon ? 12 : 0,
              fontSize: 16,
              textAlign: 'center',
            },
          ]}
          flex={icon && iconFlex === 'right' ? 1 : 0}
        />
        {icon && iconFlex === 'right' && icon}
      </TouchableOpacity>
    </View>
  ) : type === 'action' ? (
    <View style={{alignItems: 'center'}}>
      <TouchableOpacity
        disabled={disable}
        onPress={onPress}
        style={[
          {
            backgroundColor: appColors.danger,
            width: '100%',
          },
          styles,
        ]}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View>{iconAction}</View>

          <TextComponent
            text={text}
            color={textColor ?? appColors.white}
            styles={[
              {
                marginLeft: icon ? 12 : 0,
                fontSize: 16,
                textAlign: 'center',
              },
              textStyles,
            ]}
          />
        </View>
        {icon && iconFlex === 'right' && icon}
      </TouchableOpacity>
    </View>
  ) : (
    <TouchableOpacity onPress={onPress}>
      <TextComponent
        flex={0}
        text={text}
        color={type === 'link' ? appColors.link : appColors.text}
      />
    </TouchableOpacity>
  );
};

export default TouchableOpacityComponent;
