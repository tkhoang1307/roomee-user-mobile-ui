import {ActivityIndicator, FlatList, View, ViewStyle} from 'react-native';
import {useTranslation} from 'react-i18next';

import {appColors} from '@const/appColors';
import {useRequests} from '@hk/request/useRequests';
import TextComponent from '@components/TextComponent';
import TitleComponent from '@components/TitleComponent';
import RequestCard from '@components/request/RequestCard';
import {RoomRequestsScreenProps} from '@models/navigators/HomNavigator';
import StatusSelect from '../DetailRequestScreen/components/StatusSelect';
import {RequestStatus} from '@models/request';
import {useEffect, useRef, useState} from 'react';
import {CircleComponent} from '@components/index';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CreateRequestModal from '@components/request/CreateRequestModal';
import {Modalize} from 'react-native-modalize';

const RoomRequestsScreen: React.FC<RoomRequestsScreenProps> = ({
  navigation,
  route,
}) => {
  const {t} = useTranslation();
  const {loading, requests, hasMore, fetchRequests, setFilter} = useRequests({
    roomId: route.params.roomId,
    accommodationId: route.params.accomId,
  });
  const modalizeRef = useRef<Modalize>();
  const [status, setStatus] = useState<RequestStatus | 'all'>('all');

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
        title={`${t('request.pluralLabel')} - ${t('label.room')} ${
          route.params.roomName
        }`}
        titleStyle={{fontSize: 16, marginTop: -2}}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginTop: 2,
          paddingHorizontal: 20,
        }}>
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
        <FlatList
          contentContainerStyle={{flexGrow: 1, paddingHorizontal: 4, rowGap: 8}}
          data={requests}
          keyExtractor={item => item.id}
          onEndReachedThreshold={1}
          onEndReached={() =>
            fetchRequests(false, requests[requests.length - 1].id)
          }
          renderItem={({item}) => (
            <RequestCard request={item} navigation={navigation} />
          )}
          ListFooterComponent={ListEndLoader}
          refreshing={loading && requests.length === 0}
          onRefresh={() => fetchRequests(true, '')}
        />
      )}
      <View style={{position: 'absolute', bottom: 25, right: 25}}>
        <CircleComponent
          onPress={() => {
            modalizeRef.current?.open();
          }}
          size={55}>
          <Icon name="plus" size={30} color={appColors.white} />
        </CircleComponent>
      </View>
      <CreateRequestModal
        roomId={route.params.roomId}
        modalizeRef={modalizeRef}
        accomId={route.params.accomId}
      />
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

export default RoomRequestsScreen;
