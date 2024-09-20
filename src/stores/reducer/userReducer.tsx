import {UserConst} from '@const/index';
import {UserState} from '@models/user';
import {removeStorage, setStorage} from '@utils/storageUtil';

// const user = localStorage.getItem('user');

const resetInitialState = {
  username: '',
  name: '',
  id: '',
  emailVerified: false,
  phoneVerified: false,
  phoneNumber: '',
  role: '',
  roleId: '',
  imageUrl: '',
  birthday: '',
  isBanned: false,
  createdAt: '',
  updatedAt: '',
  banned: false,
  locked: false,
};

const userInitialState = resetInitialState;

interface Action {
  type: string;
  payload?: any;
}

export {userInitialState};

export default function UserReducer(state: UserState, action: Action) {
  const {type, payload} = action;
  switch (type) {
    case UserConst.EDIT_PROFILE:
      setStorage('user', {...state, ...payload});
      return {
        ...state,
        ...payload,
      };
    case UserConst.LOG_OUT:
      removeStorage('user');
      return {
        ...resetInitialState,
      };
    case UserConst.VERIFY_EMAIL:
      const verifiedUser = state;
      verifiedUser.emailVerified = true;
      setStorage('user', verifiedUser);
      removeStorage('trackingId');
      return verifiedUser;
    default:
      return {
        ...state,
      };
  }
}
