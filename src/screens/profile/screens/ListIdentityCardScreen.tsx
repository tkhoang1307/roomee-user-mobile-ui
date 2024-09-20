import {View, Alert, TouchableOpacity, ActivityIndicator} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';

import {globalStyles} from '@styles';
import {
  ContainerComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
  TitleComponent,
} from '@components/index';
import {appColors} from '@const/appColors';
import {IdentityCardModel} from '@models/tenant';
import {userService} from '@services';
import {ListIdentityCardScreenProps} from '@models/navigators/ProfileNavigator';
import OwnerIdentityCard from '../components/OwnerIdentityCard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useIsFocused} from '@react-navigation/native';

const ListIdentityCardScreen: React.FC<ListIdentityCardScreenProps> = ({
  navigation,
}) => {
  const {t} = useTranslation();
  const isFocused = useIsFocused();
  const [idCards, setIdCards] = useState<IdentityCardModel[]>([]);
  const [loading, setLoading] = useState(false);

  const listIdCards = useMemo(() => {
    return idCards.map(card => (
      <OwnerIdentityCard key={card.id} card={card} setCards={setIdCards} />
    ));
  }, [idCards]);

  const fetchListCards = useCallback(async () => {
    try {
      setLoading(true);
      const cards = await userService.getOwnerIdCards();
      setIdCards(cards);
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
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchListCards();
    }
  }, [isFocused, fetchListCards]);

  useEffect(() => {
    const getIdCards = async () => {
      try {
        setLoading(true);
        const cards = await userService.getOwnerIdCards();
        setIdCards(cards);
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

    getIdCards();
  }, []);

  return (
    <View style={[globalStyles.container, {position: 'relative'}]}>
      <TitleComponent
        back
        title={t('actions.viewIdCard')}
        titleStyle={{fontSize: 20, marginTop: -2}}
      />
      <SpaceComponent height={10} />
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            height: '100%',
          }}>
          <ActivityIndicator size={30} color={appColors.primary} />
        </View>
      ) : (
        <>
          <SectionComponent
            styles={{backgroundColor: appColors.white, flex: 1}}>
            <ContainerComponent isScroll backgroundColor={appColors.white}>
              {loading ? (
                <></>
              ) : idCards.length !== 0 ? (
                listIdCards
              ) : (
                <View
                  style={{
                    marginTop: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TextComponent size={20}>{t('label.noIdCard')}</TextComponent>
                </View>
              )}
            </ContainerComponent>
          </SectionComponent>

          <TouchableOpacity
            style={{
              position: 'absolute',
              bottom: 30,
              right: 20,
              height: 60,
              width: 60,
              borderRadius: 40,
              backgroundColor: appColors.primary,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 20,
            }}
            onPress={() => {
              navigation.navigate('CreateIdentityCardScreen');
            }}>
            <Icon name="plus" size={30} color={appColors.white} />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default ListIdentityCardScreen;
