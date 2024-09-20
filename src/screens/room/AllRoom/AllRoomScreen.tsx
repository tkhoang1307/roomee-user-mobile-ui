import {Alert, FlatList, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {AllRoomScreenProps} from '@models/navigators/HomNavigator';
import CardRoomComponent from './components/CardRoomComponent';
import {globalStyles} from '@styles';
import {
  Can,
  LoadingScreenComponent,
  SectionComponent,
  TextComponent,
  TitleComponent,
} from '@components/index';
import {fontFamilies} from '@const/fontFamilies';
import {appColors} from '@const/appColors';
import {roomService} from '@services';
import {AccomRoomModel, GroupedRoomsModel} from '@models/accommodation';
import {AbilityActionEnum, AbilitySubjectEnum} from '@const/abilities';

const AllRoomScreen: React.FC<AllRoomScreenProps> = ({navigation, route}) => {
  const {t} = useTranslation();
  const {accommodationID, accommodationName} = route.params;
  const [loading, setLoading] = useState(true);
  const [reLoading, setReLoading] = useState(false);
  const [groupedRooms, setGroupedRooms] = useState<GroupedRoomsModel[]>([]);
  const [accomRooms, setAccomRooms] = useState<AccomRoomModel[]>([]);

  // Filter and sort
  const [order, setOrder] = useState<'EMPTY' | 'FILLED' | ''>('');

  const toggleOrderEmpty = () => {
    setOrder(prevOrder => (prevOrder === 'EMPTY' ? '' : 'EMPTY'));
  };

  const toggleOrderFilled = () => {
    setOrder(prevOrder => (prevOrder === 'FILLED' ? '' : 'FILLED'));
  };

  const filteredRooms = useMemo(() => {
    if (order === 'EMPTY') {
      return accomRooms.filter(room => room.tenants === 0);
    } else if (order === 'FILLED') {
      return accomRooms.filter(room => room.tenants > 0);
    }
    return accomRooms;
  }, [accomRooms, order]);

  useEffect(() => {
    const fetchAllRoomsInAccomodation = async () => {
      try {
        // setLoading(true);
        const data = await roomService.getAllRoomAccomodation(
          accommodationID || '',
        );
        const transformedRoom: GroupedRoomsModel[] = data.reduce<
          GroupedRoomsModel[]
        >((acc, room) => {
          const floorIndex = acc.findIndex(
            item => item.floor === room.floor.toString(),
          );

          if (floorIndex !== -1) {
            acc[floorIndex].rooms.push(room);
            acc[floorIndex].rooms.sort((a, b) => a.name.localeCompare(b.name));
          } else {
            acc.push({
              floor: room.floor.toString(),
              rooms: [room].sort((a, b) => a.name.localeCompare(b.name)),
            });
          }

          return acc;
        }, []);

        const transformedRoomSorted = transformedRoom.sort((a, b) =>
          a.floor.localeCompare(b.floor),
        ); // sorted floor
        const accomRooms = transformedRoomSorted.map(item => item.rooms).flat();
        setAccomRooms(accomRooms);
        setGroupedRooms(transformedRoomSorted);
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

    fetchAllRoomsInAccomodation();
  }, [accommodationID, reLoading]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setReLoading(pre => !pre);
    });

    return unsubscribe;
  }, [navigation]);

  const renderListComponent = () => (
    <Can I={AbilityActionEnum.FILTER} a={AbilitySubjectEnum.ROOM}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 10,
          marginBottom: 10,
        }}>
        <TouchableOpacity onPress={toggleOrderEmpty}>
          <View
            style={{
              borderColor: appColors.primary,
              padding: 10,
              borderRadius: 50,
              backgroundColor:
                order === 'EMPTY' ? appColors.primary : appColors.white,
            }}>
            <TextComponent
              text={t('room.emptyRoom')}
              styles={{
                color: order === 'EMPTY' ? appColors.white : appColors.text,
              }}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleOrderFilled}>
          <View
            style={{
              borderColor: appColors.primary,
              padding: 10,
              borderRadius: 50,
              backgroundColor:
                order === 'FILLED' ? appColors.primary : appColors.white,
            }}>
            <TextComponent
              text={t('room.hadTenant')}
              styles={{
                color: order === 'FILLED' ? appColors.white : appColors.text,
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    </Can>
  );
  return (
    <View style={[globalStyles.container, {position: 'relative'}]}>
      <TitleComponent
        back
        title={t('accommodation.listRoomTitle')}
        titleStyle={{fontSize: 20, marginTop: -2}}
      />

      {loading && <LoadingScreenComponent loading={loading} />}
      <SectionComponent
        styles={{
          marginTop: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View
          style={{
            height: '100%',
            backgroundColor: appColors.primary,
            width: 5,
            borderRadius: 4,
            marginRight: 10,
          }}
        />
        <TextComponent
          text={`${t('accommodation.accommodationText')}: ${accommodationName}`}
          styles={{fontFamily: fontFamilies.medium, fontSize: 20}}
        />
      </SectionComponent>
      <SectionComponent styles={{marginBottom: 100}}>
        <FlatList
          data={filteredRooms}
          renderItem={({item}) => (
            <CardRoomComponent
              key={item.id}
              room={item}
              onPress={() => {
                navigation.navigate('DetailRoomScreen', {
                  accommodationId: accommodationID,
                  roomId: item.id,
                  roomName: item.name,
                  floor: item.floor,
                });
              }}
              navigation={navigation}
            />
          )}
          ListHeaderComponent={renderListComponent()}
        />
      </SectionComponent>
      <Can I={AbilityActionEnum.EDIT} a={AbilitySubjectEnum.ROOM}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            height: 60,
            width: 60,
            borderRadius: 40,
            backgroundColor: appColors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 20,
          }}
          onPress={() => {
            navigation.navigate('AddRoomScreen', {
              floorNumber: groupedRooms.length,
              accommodationID: accommodationID,
            });
          }}>
          <Icon name="plus" size={30} color={appColors.white} />
        </TouchableOpacity>
      </Can>
    </View>
  );
};

export default AllRoomScreen;
