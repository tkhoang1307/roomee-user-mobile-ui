import {View, ActivityIndicator, StyleSheet, Modal} from 'react-native';
import React from 'react';
import {appColors} from '@const/appColors';
interface Props {
  loading: boolean;
  topMargin?: number;
}
const LoadingScreenComponent: React.FC<Props> = ({loading, topMargin}) => {
  return (
    <View style={[LoadingStyle.overlay, {top: topMargin ? topMargin : 0}]}>
      <ActivityIndicator color={appColors.primary} size={'large'} />
    </View>
  );
};

export default LoadingScreenComponent;

const LoadingStyle = StyleSheet.create({
  overlay: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.307)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
});
