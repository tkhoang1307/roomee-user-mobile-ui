import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
} from 'react-native';

const widthScreen = Dimensions.get('window').width;
const SplashScreen = () => {
  return (
    <ImageBackground
      source={require('../assets/images/splash-img.png')}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      imageStyle={{flex: 1}}>
      <Image
        source={require('../assets/images/logo.png')}
        style={{
          width: widthScreen * 0.7,
          resizeMode: 'contain',
        }}
      />
      {/* <SpaceComponent height={16} /> */}
      <ActivityIndicator size={22} />
    </ImageBackground>
  );
};

export default SplashScreen;
