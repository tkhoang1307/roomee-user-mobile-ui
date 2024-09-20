import {View} from '@ant-design/react-native';
import {useNavigation} from '@react-navigation/native';
import React, {useContext} from 'react';
import {Image} from 'react-native';

import {CardComponent, SpaceComponent, TextComponent} from '@components/index';
import {appColors} from '@const/appColors';
import {AccommodationModel} from '@models/accommodation';
import {CardAccomStyles} from '../styles';
import {UserContext} from '@context';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  item: AccommodationModel;
}

const CardAccommodationComponent = (props: Props) => {
  const {userState} = useContext(UserContext);
  const {item} = props;

  const navigation: any = useNavigation();

  const handleClickAccomCard = async () => {
    await AsyncStorage.setItem(userState.id, item.id);

    navigation.navigate('DetailAccommodationScreen', {
      accommodationInfor: item,
    });
  };

  return (
    <CardComponent
      isShadow
      styles={{backgroundColor: appColors.backgroundCard}}
      onPress={() => handleClickAccomCard()}>
      <View style={{flex: 1}}>
        <Image
          style={{
            flex: 1,
            marginBottom: 12,
            height: 131,
            width: 'auto',
            padding: 10,
            position: 'relative',
            objectFit: 'contain',
          }}
          source={require('../../../assets/images/various-houses.png')}
        />
        <View style={CardAccomStyles.borderCornerFirstStyle}>
          <View style={CardAccomStyles.backgroundCornerStyle} />
        </View>
        <TextComponent numberOfLine={1} text={item.name} title size={18} />
        <SpaceComponent width={8} />
        <View style={CardAccomStyles.borderCornerSecondStyle}>
          <View style={CardAccomStyles.backgroundCornerStyle} />
        </View>
        <TextComponent
          styles={{flexShrink: 1}}
          numberOfLine={3}
          text={
            item.location?.street +
            ' ' +
            item.location?.district +
            ' ' +
            item.location?.cityProvince
          }
          size={12}
          color={appColors.text}
        />
      </View>
    </CardComponent>
  );
};

export default CardAccommodationComponent;
