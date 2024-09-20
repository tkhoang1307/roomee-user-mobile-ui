import {requestForToken} from '@libs/firebase';
import {useContext, useEffect, useState} from 'react';
import messaging from '@react-native-firebase/messaging';

import {NotiContext} from '@context';
import {notificationService} from '@services';
import {NotificationActionEnum, NotificationType} from '@const/notification';

export const requestToken = async () => {
  const token = await requestForToken();
  if (!token) {
    return;
  }
  try {
    await notificationService.registerNotification(token);
  } catch (error) {
    console.log(error);
  }
};
export const useFirebaseToken = () => {
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    requestToken().then(_token => setToken(token));
  }, []);

  return token;
};

export const useNotification = () => {
  const {notiStore, notiDispatch} = useContext(NotiContext);

  const handleNextPage = async (type: NotificationType) => {
    let cusor = '';
    if (notiStore[type].length > 0)
      cusor = notiStore[type][notiStore.event.length - 1].id;

    const notis = await notificationService.getNotifications(cusor, type);
    notiDispatch({
      type: NotificationActionEnum.PUSH_NOTI,
      payload: {
        type,
        notis,
      },
    });
  };

  return {
    handleNextPage,
  };
};

export const useMessageListener = () => {
  const {notiDispatch} = useContext(NotiContext);
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage.data)
        notiDispatch({
          type: NotificationActionEnum.PUSH_MSG,
          payload: {
            msg: remoteMessage.data as any,
          },
        });
    });

    return unsubscribe;
  }, []);
};
