import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useEffect, useMemo, useState} from 'react';
import {TextareaItem} from '@ant-design/react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import useRoomName from '@hk/useRoomName';
import {appColors} from '@const/appColors';
import {RequestStatus} from '@models/request';
import {useRequests} from '@hk/request/useRequests';
import TextComponent from '@components/TextComponent';
import TitleComponent from '@components/TitleComponent';
import RequestCard from '@components/request/RequestCard';
import {AccomRequestsScreenProps} from '@models/navigators/HomNavigator';
import StatusSelect from '@screens/request/DetailRequestScreen/components/StatusSelect';

const AccomRequestsScreen: React.FC<AccomRequestsScreenProps> = ({
  navigation,
  route,
}) => {
  const {t} = useTranslation();
  const accom = useMemo(() => route.params.accom, []);
  const {loading, requests, setFilter, hasMore, fetchRequests, filter} =
    useRequests({
      accommodationId: accom.id,
    });
  const {getRoomNameFromId, getRoomIdFromRoomname} = useRoomName({
    rooms: accom.rooms || [],
  });
  const [status, setStatus] = useState<RequestStatus | 'all'>('all');
  const [roomName, setRoomName] = useState<string>();

  const ListEndLoader = () => {
    if (loading) {
      // Show loader at the end of list when fetching next page data.
      return (
        <View style={footerContainerStyle}>
          <ActivityIndicator size={'large'} color={appColors.primary} />
        </View>
      );
    }
    if (!hasMore) {
      return (
        <View style={footerContainerStyle}>
          <TextComponent>{t('request.noMoreRequest')}</TextComponent>
        </View>
      );
    }
  };

  useEffect(() => {
    setFilter(prev => ({
      ...prev,
      status: status,
    }));
  }, [status]);

  return (
    <View style={{rowGap: 4, flex: 1}}>
      <TitleComponent
        back
        backgroundColor={appColors.backgroundCard}
        // title={`${t('request.pluralLabel')} - ${t('label.accommodation')} ${
        //   accom.name
        // }`}
        title={t('label.requestsList')}
        titleStyle={{fontSize: 16, marginTop: -2}}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 2,
          paddingHorizontal: 4,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 8,
          }}>
          <TextareaItem
            rows={1}
            placeholder={t('label.roomName') + ' ...'}
            style={{
              borderRadius: 12,
              borderColor: appColors.gray2,
              borderWidth: 1,
              paddingRight: 16,
              paddingLeft: 16,
              height: 40,
              width: 140,
              paddingBottom: 4,
            }}
            onChange={e => setRoomName(e || undefined)}
            value={roomName}
            onBlur={() =>
              setFilter(prev => {
                const newRoomId = roomName
                  ? getRoomIdFromRoomname(roomName)
                  : undefined;
                if (newRoomId === filter.roomIdByName) return prev;

                return {
                  ...prev,
                  roomIdByName: newRoomId,
                };
              })
            }
          />
          <TouchableOpacity
            style={{opacity: roomName && roomName.length > 0 ? undefined : 0}}
            disabled={roomName && roomName.length > 0 ? false : true}
            onPress={() => {
              if (
                roomName?.toLowerCase() !==
                getRoomNameFromId(filter.roomIdByName || '')?.toLowerCase()
              ) {
                setRoomName(undefined);
                return;
              }
              setFilter(prev => ({
                ...prev,
                roomIdByName: undefined,
              }));
              setRoomName(undefined);
            }}>
            <Icon name="close" size={16} color={appColors.gray} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 8,
          }}>
          <StatusSelect
            value={status}
            setValue={setStatus}
            type="select"
            loading={false}
            all
          />
        </View>
      </View>
      {loading && requests.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            height: '100%',
          }}>
          <ActivityIndicator size={30} color={appColors.primary} />
        </View>
      ) : requests.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TextComponent>{t('request.empty')}</TextComponent>
        </View>
      ) : (
        <>
          <FlatList
            contentContainerStyle={{flexGrow: 1, padding: 4, rowGap: 8}}
            data={requests}
            keyExtractor={item => item.id}
            onEndReachedThreshold={1}
            onEndReached={() =>
              fetchRequests(false, requests[requests.length - 1].id)
            }
            renderItem={({item}) => (
              <RequestCard
                request={item}
                navigation={navigation}
                roomName={getRoomNameFromId(item.roomId)}
              />
            )}
            ListFooterComponent={ListEndLoader}
            refreshing={loading && requests.length === 0}
            onRefresh={() => fetchRequests(true, '')}
          />
        </>
      )}
    </View>
  );
};

const footerContainerStyle: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: -1,
  paddingTop: 4,
  paddingBottom: 20,
};

export default AccomRequestsScreen;
