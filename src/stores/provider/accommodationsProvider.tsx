import React, {useReducer, createContext} from 'react';

import {AccommodationModel} from '@models/accommodation';
import AccommodationsReducer, {
  initialState,
} from '../reducer/accommodationsReducer';

const AccommodationsContext = createContext<{
  accommodations: Array<AccommodationModel>;
  accommodationsDispatch: React.Dispatch<{
    type: string;
    payload?: any;
  }>;
}>({
  accommodations: initialState,
  accommodationsDispatch: () => null,
});

function AccommodationsProvider({children}: {children?: React.ReactNode}) {
  const [accommodations, accommodationsDispatch] = useReducer(
    AccommodationsReducer,
    initialState,
  );
  return (
    <AccommodationsContext.Provider
      value={{
        accommodations: accommodations,
        accommodationsDispatch: accommodationsDispatch,
      }}>
      {children}
    </AccommodationsContext.Provider>
  );
}

export {AccommodationsContext, AccommodationsProvider};
