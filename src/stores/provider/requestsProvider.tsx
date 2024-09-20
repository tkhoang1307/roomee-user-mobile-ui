import React, {createContext, useState} from 'react';

import {RequestModel} from '@models/request';

const RequestsContext = createContext<{
  requests: RequestModel[];
  setRequests: React.Dispatch<React.SetStateAction<RequestModel[]>>;
}>({
  requests: [],
  setRequests: () => null,
});

function RequestsProvider({children}: {children?: React.ReactNode}) {
  // const [requestsStore, requestsDispatch] = useReducer(RequestsReducer, initialState);
  const [requests, setRequests] = useState<RequestModel[]>([]);
  return (
    <RequestsContext.Provider
      value={{
        requests,
        setRequests,
      }}>
      {children}
    </RequestsContext.Provider>
  );
}

export {RequestsContext, RequestsProvider};
