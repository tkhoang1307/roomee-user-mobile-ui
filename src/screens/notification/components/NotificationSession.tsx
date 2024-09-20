import {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from '@ant-design/react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ActivityIndicator, Alert, FlatList, ViewStyle} from 'react-native';
import {NotificationActionEnum, NotificationType} from '@const/notification';

import NotiCard from './NotiCard';
import {NotiContext} from '@context';
import {appColors} from '@const/appColors';
import {notificationService} from '@services';
import TextComponent from '@components/TextComponent';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {NotificationStackParamList} from '@models/navigators/NotificationNavigator';

interface NotificationSessionProps {
  tab: NotificationType;
  navigation: NativeStackNavigationProp<
    NotificationStackParamList,
    'NotificationScreen',
    undefined
  >;
}

const NotificationSession: React.FC<NotificationSessionProps> = ({
  tab,
  navigation,
}) => {
  const {t, i18n} = useTranslation();
  const {notiStore, notiDispatch} = useContext(NotiContext);
  const notis = notiStore[tab];
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState('');

  const fetchOlderNotis = async () => {
    if (!hasMore) return;
    if (cursor === notis[notis.length - 1].id) return;

    setCursor(notis[notis.length - 1].id);
    setLoading(true);

    try {
      const rs = await notificationService.getNotifications(
        notis[notis.length - 1].id,
        tab,
      );

      if (rs.length > 0)
        notiDispatch({
          type: NotificationActionEnum.PUSH_NOTI,
          payload: {
            notis: rs,
            type: tab,
          },
        });

      if (rs.length < 10) setHasMore(false);
      else setHasMore(true);
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

  const ListEndLoader = () => {
    if (loading || notiStore.loading) {
      // Show loader at the end of list when fetching next page data.
      return (
        <View style={footerContainerStyle}>
          <ActivityIndicator size={'large'} color={appColors.primary} />
        </View>
      );
    }
    return (
      <View style={footerContainerStyle}>
        <TextComponent>{t('notifications.noOlderNotis')}</TextComponent>
      </View>
    );
  };

  useEffect(() => {
    setHasMore(true);
    setCursor('');
  }, [i18n.language]);

  return (
    <>
      {notiStore.loading ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: 1,
          }}>
          <ActivityIndicator color={appColors.primary} size={40} />
        </View>
      ) : notis.length === 0 ? (
        <View
          style={{
            height: '80%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon
            name="bell-off"
            size={80}
            style={{
              backgroundColor: appColors.gray5,
              borderRadius: 80,
              padding: 40,
              color: appColors.primary,
            }}
          />
          <TextComponent title>{t('notifications.empty')}</TextComponent>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 45,
          }}
          data={notis}
          keyExtractor={item => item.id}
          onEndReachedThreshold={1}
          onEndReached={() => fetchOlderNotis()}
          renderItem={({item}) => (
            <NotiCard navigation={navigation} noti={item} key={item.id} />
          )}
          ListFooterComponent={ListEndLoader}
        />
      )}
    </>
  );
};

const footerContainerStyle: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: -1,
};

export default NotificationSession;
