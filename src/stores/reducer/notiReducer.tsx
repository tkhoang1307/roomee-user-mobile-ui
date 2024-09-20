import {NotificationActionEnum, NotificationType} from '@const/notification';
import {NotificationModel, NotificationStoreModel} from '@models/notification';

export const initialState: NotificationStoreModel = {
  event: [],
  topic: [],
  comment: [],
  loading: true,
};

interface Action {
  type: NotificationActionEnum;
  payload?: {
    type?: NotificationType;
    notis?: NotificationModel[];
    msg?: NotificationModel;
    loading?: boolean;
    notiId?: string;
  };
}

export default function NotiReducer(
  notiStore: NotificationStoreModel,
  action: Action,
) {
  const {type, payload} = action;
  const notiType = payload?.type?.toLowerCase() as NotificationType;
  const notis = payload?.notis || [];
  const msg = payload?.msg;
  const msgType = payload?.msg?.type.toLowerCase() as NotificationType;
  const loading = payload?.loading || false;
  const notiId = payload?.notiId || '';
  switch (type) {
    case NotificationActionEnum.RESET_NOTI:
      return initialState;
    case NotificationActionEnum.SET_LOADING:
      notiStore.loading = loading;
      return {...notiStore};
    case NotificationActionEnum.PUSH_NOTI:
      if (notiType) notiStore[notiType].push(...notis);
      return {...notiStore};
    case NotificationActionEnum.SET_NOTI:
      if (notiType) notiStore[notiType] = notis;
      return {...notiStore};
    case NotificationActionEnum.PUSH_MSG:
      if (msg) {
        msg.isRead = false;
        notiStore[msgType].unshift(msg);
      }
      return {...notiStore};
    case NotificationActionEnum.MARK_AS_READ:
      const index = notiStore[notiType].findIndex(n => n.id === notiId);
      if (index !== -1) notiStore[notiType][index].isRead = true;
      return {...notiStore};
    default:
      return notiStore;
  }
}
