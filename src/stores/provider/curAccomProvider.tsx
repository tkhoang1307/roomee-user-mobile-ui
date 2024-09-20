import React, {useReducer, createContext} from 'react';

import {AccommodationModel} from '@models/accommodation';
import CurAccomReducer, {initialState} from '../reducer/curAccomReducer';

const CurAccomContext = createContext<{
  curAccom: AccommodationModel;
  curAccomDispatch: React.Dispatch<{
    type: string;
    payload?: any;
  }>;
}>({
  curAccom: initialState,
  curAccomDispatch: () => null,
});

function CurAccomProvider({children}: {children?: React.ReactNode}) {
  const [accom, curAccomDispatch] = useReducer(CurAccomReducer, initialState);
  return (
    <CurAccomContext.Provider
      value={{
        curAccom: accom,
        curAccomDispatch: curAccomDispatch,
      }}>
      {children}
    </CurAccomContext.Provider>
  );
}

export {CurAccomContext, CurAccomProvider};
