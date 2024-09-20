import {AuthConst} from '@const/index';
import {AuthState} from '@models/auth';
import {removeStorage, setStorage} from '@utils/storageUtil';

const resetInitialState = {
  token: {
    accessToken: '',
    refreshToken: '',
    expiresTime: '',
  },
  device: {},
};

const authInitialState = {
  token: {
    accessToken: '',
    refreshToken: '',
    expiresTime: '',
  },
  device: {},
};

interface Action {
  type: string;
  payload?: any;
}

export {authInitialState};

export default function AuthReducer(state: AuthState, action: Action) {
  const {type, payload} = action;
  switch (type) {
    case AuthConst.LOGIN:
      const {token, device} = payload;
      setStorage('token', token);
      setStorage('device', device);
      // AsyncStorage.setItem('tracking', JSON.stringify(tracking));
      return {
        ...state,
        token,
        device,
      };
    case AuthConst.LOG_OUT:
      removeStorage('token');
      removeStorage('device');
      return {
        ...resetInitialState,
      };
    default:
      return {...state};
  }
}
