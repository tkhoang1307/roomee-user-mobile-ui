import {View, TouchableOpacity, ActivityIndicator, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {RoomPropertyModel} from '@models/room';
import CardTitleWithSharp from '@components/CardTitleWithSharp';
import {globalStyles} from '@styles';
import {Can} from '@context';
import {AbilityActionEnum, AbilitySubjectEnum} from '@const/abilities';
import BasicRoomPropertyCard from './BasicRoomPropertyCard';
import {appColors} from '@const/appColors';
import {RootStackParamList} from '@models/navigators/HomNavigator';
import {roomService} from '@services';
import {TextComponent} from '@components/index';

interface IRoomPropertyCardProps {
  roomId: string;
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'DetailRoomScreen',
    undefined
  >;
  reloadFlag: boolean;
}

const RoomPropertyCard: React.FC<IRoomPropertyCardProps> = ({
  roomId,
  navigation,
  reloadFlag,
}) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);

  const [listRoomProperties, setListRoomProperties] = useState<
    RoomPropertyModel[]
  >([]);

  useEffect(() => {
    setLoading(true);
    const fetchRoomProperties = async () => {
      try {
        const resData = await roomService.getAllRoomProperties(roomId);
        setListRoomProperties(resData);
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

    fetchRoomProperties();
  }, [reloadFlag]);

  return (
    <View style={globalStyles.cardInfo}>
      <CardTitleWithSharp title={t(`pageTitle.listRoomProperties`)}>
        <Can I={AbilityActionEnum.CREATE} a={AbilitySubjectEnum.ROOM_PROPERTY}>
          <TouchableOpacity
            style={globalStyles.iconButton}
            onPress={() => {
              navigation?.navigate('AddPropertyScreen', {
                roomId: roomId,
              });
            }}>
            <Icon name="plus" size={30} />
          </TouchableOpacity>
        </Can>
      </CardTitleWithSharp>

      <View style={{paddingHorizontal: 8, paddingVertical: 8, rowGap: 4}}>
        {loading ? (
          <View
            style={{
              minHeight: 100,
              justifyContent: 'center',
              alignItems: 'center',
              rowGap: 8,
            }}>
            <ActivityIndicator size={30} color={appColors.primary} />
          </View>
        ) : listRoomProperties.length > 0 ? (
          <>
            {listRoomProperties.map(property => (
              <BasicRoomPropertyCard
                key={property.id}
                property={property}
                roomId={roomId}
                navigation={navigation}
                setListRoomProperties={setListRoomProperties}
              />
            ))}
          </>
        ) : (
          <View
            style={{
              minHeight: 100,
              justifyContent: 'center',
              alignItems: 'center',
              rowGap: 8,
            }}>
            <TextComponent>{t('label.emptyCurrentProperty')}</TextComponent>
          </View>
        )}
      </View>
    </View>
  );
};

export default RoomPropertyCard;
