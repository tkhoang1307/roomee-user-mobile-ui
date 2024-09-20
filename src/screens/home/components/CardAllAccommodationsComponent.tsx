import {ActivityIndicator, Alert, FlatList} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

import {SectionComponent} from '@components/index';
import CardAccommodationComponent from './CardAccommodationComponent';
import {accommodationService} from '@services';
import {AllCardAccomStyles} from '../styles';
import {AccommodationsContext, UserContext} from '@context';
import {AccommodationActionEnum} from '@const/accomodation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {appColors} from '@const/appColors';

const CardAllAccommodationsComponent = () => {
  const {userState} = useContext(UserContext);
  const {accommodations, accommodationsDispatch} = useContext(
    AccommodationsContext,
  );
  const navigation: any = useNavigation();
  const {t} = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getAllAccommodations = async () => {
      try {
        setLoading(true);
        accommodationsDispatch({
          type: AccommodationActionEnum.SET_ACCOMMODATIONS,
          payload: [],
        });

        const data = await accommodationService.getAllAccommodations();
        const lastAccomIdByUser = await AsyncStorage.getItem(userState.id);

        if (lastAccomIdByUser) {
          const accom = data.find(a => a.id === lastAccomIdByUser);
          if (accom)
            navigation.navigate('DetailAccommodationScreen', {
              accommodationInfor: accom,
            });
        }
        accommodationsDispatch({
          type: AccommodationActionEnum.SET_ACCOMMODATIONS,
          payload: data,
        });
      } catch (error: any) {
        Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
          {
            text: t('actions.cancel'),
            style: 'cancel',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    getAllAccommodations();
  }, []);
  return (
    <SectionComponent styles={[AllCardAccomStyles.sectionAllCardStyle]}>
      {accommodations && accommodations.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={true}
          data={accommodations}
          renderItem={({item, index}) => (
            <CardAccommodationComponent
              key={`accommodation${index}`}
              item={item}
            />
          )}
        />
      ) : (
        <ActivityIndicator
          size="large"
          color={appColors.primary}
          style={{marginTop: 230}}
        />
      )}
    </SectionComponent>
  );
};

export default CardAllAccommodationsComponent;
