import React, {useReducer, createContext} from 'react';

import NotiReducer, {initialState} from '../reducer/notiReducer';
import {NotificationActionEnum, NotificationType} from '@const/notification';
import {NotificationModel, NotificationStoreModel} from '@models/notification';

const NotiContext = createContext<{
  notiStore: NotificationStoreModel;
  notiDispatch: React.Dispatch<{
    type: NotificationActionEnum;
    payload?: {
      type?: NotificationType;
      notis?: NotificationModel[];
      msg?: NotificationModel;
      loading?: boolean;
      notiId?: string;
    };
  }>;
}>({
  notiStore: initialState,
  notiDispatch: () => null,
});

function NotiProvider({children}: {children?: React.ReactNode}) {
  const [notiStore, notiDispatch] = useReducer(NotiReducer, initialState);
  return (
    <NotiContext.Provider
      value={{
        notiStore,
        notiDispatch,
      }}>
      {children}
    </NotiContext.Provider>
  );
}

export {NotiContext, NotiProvider};
