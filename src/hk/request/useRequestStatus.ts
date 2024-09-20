import {useContext, useState} from 'react';

import {requestService} from '@services';
import {RequestsContext} from '@context';
import {RequestStatus} from '@models/request';

export const useRequestStatus = ({requestId}: {requestId: string}) => {
  const {setRequests} = useContext(RequestsContext);
  const [statusLoading, setStatusLoading] = useState(false);

  const onRequestStatusChanged = async (status: RequestStatus) => {
    setStatusLoading(true);
    try {
      await requestService.updateRequestStatus({
        topicId: requestId,
        payload: {status},
      });
      setRequests(requests =>
        requests.map(request => {
          if (request.id === requestId) {
            return {
              ...request,
              status,
            };
          }

          return request;
        }),
      );
    } catch (err) {
      console.log('err', err);
    } finally {
      setStatusLoading(false);
    }
  };

  return {
    statusLoading,
    onRequestStatusChanged,
  };
};
