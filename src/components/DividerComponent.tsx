import {
  View,
  StyleSheet,
  DimensionValue,
  StyleProp,
  ViewStyle,
} from 'react-native';
import React from 'react';

import {appColors} from '@const/appColors';

interface Props {
  width: number | string;
  styles?: StyleProp<ViewStyle>;
}

const DividerComponent: React.FC<Props> = ({width, styles}) => {
  const isNumber = (value: number | string): value is number =>
    typeof value === 'number';
  const dividerWidth = isNumber(width) ? width : (`${width}` as DimensionValue);

  return (
    <View
      style={[
        {
          borderBottomColor: appColors.gray4,
          borderBottomWidth: StyleSheet.hairlineWidth,
          width: dividerWidth,
          marginBottom: 10,
        },
        styles,
      ]}
    />
  );
};

export default DividerComponent;
