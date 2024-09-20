import React, {useReducer, createContext} from 'react';

import UserReducer, {userInitialState} from '../reducer/userReducer';
import {UserState} from '@models/user';

const UserContext = createContext<{
  userState: UserState;
  userDispatch: React.Dispatch<{
    type: string;
    payload?: any;
  }>;
}>({
  userState: userInitialState,
  userDispatch: () => null,
});

function UserProvider({children}: {children?: React.ReactNode}) {
  const [userState, userDispatch] = useReducer(UserReducer, userInitialState);
  return (
    <UserContext.Provider value={{userState, userDispatch}}>
      {children}
    </UserContext.Provider>
  );
}

export {UserContext, UserProvider};
