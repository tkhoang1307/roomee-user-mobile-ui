import React, {useReducer, createContext} from 'react';

import AuthReducer from '../reducer/authReducer';
import {authInitialState} from '../reducer/authReducer';
import {AuthState} from '@models/auth';

const AuthContext = createContext<{
  authState: AuthState;
  authDispatch: React.Dispatch<{
    type: string;
    payload?: any;
  }>;
}>({
  authState: authInitialState,
  authDispatch: () => null,
});

function AuthProvider({children}: {children?: React.ReactNode}) {
  const [authState, authDispatch] = useReducer(AuthReducer, authInitialState);
  return (
    <AuthContext.Provider value={{authState, authDispatch}}>
      {children}
    </AuthContext.Provider>
  );
}

export {AuthContext, AuthProvider};
