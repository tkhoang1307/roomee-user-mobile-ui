import moment from 'moment';
import {useContext} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';

import {NotiContext} from '@context';
import useDateTime from '@hk/useDateTime';
import {appColors} from '@const/appColors';
import {notificationService} from '@services';
import TextComponent from '@components/TextComponent';
import {NotificationModel} from '@models/notification';
import {NotificationActionEnum} from '@const/notification';
import {NotificationStackParamList} from '@models/navigators/NotificationNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

interface NotiCardProps {
  noti: NotificationModel;
  navigation: NativeStackNavigationProp<
    NotificationStackParamList,
    'NotificationScreen',
    undefined
  >;
}

const parseMeta = (meta: unknown) => {
  if (typeof meta === 'string') {
    return JSON.parse(meta);
  }

  return meta;
};

const NotiCard: React.FC<NotiCardProps> = ({noti, navigation}) => {
  const {notiDispatch} = useContext(NotiContext);
  const {timeFromNow} = useDateTime(noti.createdAt);

  const onPressNoti = async () => {
    try {
      //mask as read
      notificationService.markAsReadNotification([
        {isRead: true, userNotificationId: noti.id},
      ]);
      notiDispatch({
        type: NotificationActionEnum.MARK_AS_READ,
        payload: {
          type: noti.type,
          notiId: noti.id,
        },
      });

      const meta = parseMeta(noti.meta);

      if (meta['request'] && meta['request']['id']) {
        navigation.navigate('DetailRequestScreen', {
          topicId: meta['request']['id'],
          roomName: meta['room']['name'],
          accomName: meta['accommodation']['name'],
        });
      }

      if (meta['contract'] && meta['contract']['id']) {
        navigation.navigate('DetailContractScreen', {
          contractId: meta['contract']['id'],
          roomName: meta['room']['name'],
          roomId: meta['room']['id'],
          accomId: meta['accommodation']['id'],
          accomName: meta['accommodation']['name'],
        });
      }

      if (meta['invoice'] && meta['invoice']['id']) {
        navigation.navigate('DetailInvoiceScreen', {
          invoiceId: meta['invoice']['id'],
          accommodationId: meta['accommodation']['id'],
        });
      }
    } catch (error: any) {
      // Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
      //   {
      //     text: t('actions.cancel'),
      //     style: 'cancel',
      //   },
      // ]);
    }
  };

  return (
    <TouchableOpacity onPress={onPressNoti}>
      <View
        style={{
          backgroundColor: appColors.white,
          paddingVertical: 12,
          paddingRight: 12,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor: appColors.gray4,
          marginBottom: 1,
          flexDirection: 'row',
        }}>
        <View>
          <Icon
            name="circle-small"
            size={40}
            color={noti.isRead ? appColors.white : appColors.primary}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            columnGap: 12,
            flex: 1,
          }}>
          <View>
            <Image
              source={{uri: noti.theme}}
              style={{width: 40, height: 40, borderRadius: 20}}
            />
          </View>
          <View style={{rowGap: 4, flexGrow: 1}}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <TextComponent flex={1}>{noti.message}</TextComponent>
            </View>
            <View
              style={{
                flexDirection: 'row',
                columnGap: 12,
                alignItems: 'center',
              }}>
              <TextComponent color={appColors.gray}>
                {timeFromNow}
              </TextComponent>
              <View
                style={{
                  width: 1,
                  borderRightWidth: 1,
                  borderColor: appColors.gray,
                  height: '80%',
                }}
              />
              <TextComponent color={appColors.gray}>
                {moment(noti.createdAt).format('hh:mm')}
              </TextComponent>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NotiCard;
