import React, {useReducer, createContext} from 'react';

import {AccommodationModel} from '@models/accommodation';
import MainAccommodationReducer, {
  initialState,
} from '../reducer/mainAccommodationReducer';

const MainAccommodationContext = createContext<{
  mainAccommodation: AccommodationModel;
  mainAccommodationDispatch: React.Dispatch<{
    type: string;
    payload?: any;
  }>;
}>({
  mainAccommodation: initialState,
  mainAccommodationDispatch: () => null,
});

function MainAccomProvider({children}: {children?: React.ReactNode}) {
  const [mainAccommodation, mainAccommodationDispatch] = useReducer(
    MainAccommodationReducer,
    initialState,
  );
  return (
    <MainAccommodationContext.Provider
      value={{
        mainAccommodation: mainAccommodation,
        mainAccommodationDispatch: mainAccommodationDispatch,
      }}>
      {children}
    </MainAccommodationContext.Provider>
  );
}

export {MainAccommodationContext, MainAccomProvider};
