import {View, TouchableOpacity} from 'react-native';
import React, {ReactNode, useRef} from 'react';
import {Modalize} from 'react-native-modalize';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {IconOutline} from '@ant-design/icons-react-native';

import {globalStyles} from '@styles';
import {appColors} from '@const/appColors';
import {
  Can,
  PortalModalizeComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '@components/index';
import {HomeStyles} from './styles';
import CardAllAccommodationsComponent from './components/CardAllAccommodationsComponent';
import {fontFamilies} from '@const/fontFamilies';
import {HomeScreenProps} from '@models/navigators/HomNavigator';
import {AccommodationMenu} from '@const/accomodation';
import {AbilityActionEnum, AbilitySubjectEnum} from '@const/abilities';

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const {t} = useTranslation();

  const modalizeRef = useRef<Modalize>();
  const choiceBars = [
    {
      key: AccommodationMenu.ADDACCOMMODATION,
      title: t('actions.addAccommodation'),
      icon: <Icon name="home-plus-outline" size={25} color={appColors.text} />,
    },
    {
      key: AccommodationMenu.MANAGER,
      title: t('actions.manager'),
      icon: (
        <Icon name="account-cog-outline" size={25} color={appColors.text} />
      ),
    },
  ];
  const renderItem = (item: {icon: ReactNode; key: string; title: string}) => (
    <RowComponent
      key={item.key}
      styles={{marginBottom: 20}}
      onPress={() => handleChoiceAccommodation(item.key)}>
      {item.icon}
      <SpaceComponent width={12} />
      <TextComponent text={item.title} flex={1} styles={{fontSize: 16}} />
    </RowComponent>
  );
  const handleChoiceAccommodation = (key: string) => {
    switch (key) {
      case AccommodationMenu.MANAGER:
        navigation.navigate('ListManagerScreen');
        break;

      case AccommodationMenu.ADDACCOMMODATION:
        navigation.navigate('AddAccommodationScreen');
        break;
      default:
        break;
    }

    modalizeRef.current?.close();
  };

  return (
    <View style={[globalStyles.container]}>
      <PortalModalizeComponent
        choiceBars={choiceBars}
        modalizeRef={modalizeRef}
        renderItem={renderItem}
      />
      <View style={HomeStyles.viewHeaderBarStyle}>
        <View style={HomeStyles.circleFirstStyle} />
        <View style={[HomeStyles.circleSecondStyle, globalStyles.shadow]} />
        <RowComponent
          justify="space-between"
          styles={{paddingHorizontal: 16, alignItems: 'center'}}>
          <View style={{width: 25}} />
          <TextComponent
            font={fontFamilies.bold}
            // flex={1}
            text={t('screensTitle.listAccommodations')}
            color={appColors.white}
            size={16}
            styles={[HomeStyles.textTileStyle]}
          />
          <View style={{width: 25}}>
            <Can I={AbilityActionEnum.CREATE} a={AbilitySubjectEnum.CONTRACT}>
              <TouchableOpacity onPress={() => modalizeRef.current?.open()}>
                <IconOutline
                  name="bars"
                  size={25}
                  color={appColors.white}
                  style={{paddingTop: 5}}
                />
              </TouchableOpacity>
            </Can>
          </View>
        </RowComponent>

        <SpaceComponent height={40} />
      </View>
      <CardAllAccommodationsComponent />
    </View>
  );
};

export default HomeScreen;
