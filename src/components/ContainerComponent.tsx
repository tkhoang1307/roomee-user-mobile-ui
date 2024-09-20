import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  StyleProp,
  TextStyle,
} from 'react-native';
import React, {ReactNode} from 'react';
import {useNavigation} from '@react-navigation/native';
import {IconOutline} from '@ant-design/icons-react-native';

import RowComponent from './RowComponent';
import TextComponent from './TextComponent';

interface Props {
  isImageBackground?: boolean;
  isScroll?: boolean;
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
  children: ReactNode;
  back?: boolean;
  titleMiddle?: string;
  backgroundColor?: string;
}

const ContainerComponent = (props: Props) => {
  const {
    children,
    isScroll,
    isImageBackground,
    title,
    titleStyle,
    back,
    titleMiddle,
    backgroundColor,
  } = props;

  const navigation: any = useNavigation();

  const headerComponent = () => {
    return (
      <View style={{flex: 1, backgroundColor: backgroundColor}}>
        {(title || back) && (
          <RowComponent
            styles={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              minWidth: 48,
              minHeight: 48,
              justifyContent: 'flex-start',
            }}>
            {back && (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{marginRight: 12}}>
                <IconOutline name="arrow-left" size={28} />
              </TouchableOpacity>
            )}
            {title ? (
              <TextComponent text={title} styles={[titleStyle]} />
            ) : (
              <></>
            )}
          </RowComponent>
        )}
        {titleMiddle && (
          <RowComponent
            styles={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              minWidth: 48,
              minHeight: 48,
              justifyContent: 'center',
            }}>
            <Text style={{textAlign: 'center'}}>{titleMiddle}</Text>
          </RowComponent>
        )}
        {returnContainer}
      </View>
    );
  };

  const returnContainer = isScroll ? (
    <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={{flex: 1}}>{children}</View>
  );

  return isImageBackground ? (
    <ImageBackground
      source={require('../assets/images/splash-img.png')}
      style={{flex: 1}}
      imageStyle={{flex: 1}}>
      {/* <SafeAreaView style={{flex: 1}}> */}
      {headerComponent()}
      {/* </SafeAreaView> */}
    </ImageBackground>
  ) : (
    // <SafeAreaView style={[globalStyles.container]}>
    <ScrollView>{headerComponent()}</ScrollView>
    // </SafeAreaView>
  );
};

export default ContainerComponent;
