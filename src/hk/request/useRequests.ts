import {useContext, useEffect, useState} from 'react';

import {requestService} from '@services';
import {RequestsContext} from '@context';
import {uniqBy} from 'lodash';

export const useRequests = ({
  accommodationId,
  roomId,
}: {
  accommodationId: string;
  roomId?: string;
}) => {
  const [filter, setFilter] = useState<{
    type: string;
    status: string;
    roomIdByName: string | undefined;
  }>({
    type: '',
    status: '',
    roomIdByName: undefined,
  });
  const [hasMore, setHasMore] = useState(true);
  const {requests, setRequests} = useContext(RequestsContext);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async (reload: boolean, cursor: string) => {
    if (!hasMore && !reload) return;
    if (reload) setRequests([]);
    try {
      setLoading(true);

      const res = await requestService.getRequests({
        cursor: cursor,
        type: filter.type,
        status: filter.status === 'all' ? undefined : filter.status,
        accommodationId,
        roomId: roomId
          ? roomId
          : filter.roomIdByName
          ? filter.roomIdByName
          : undefined,
      });

      if (res.length < 10) setHasMore(false);
      else setHasMore(true);

      if (reload) setRequests(res);
      else setRequests(prev => uniqBy([...prev, ...res], 'id'));
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(true, '');
  }, [filter]);

  useEffect(() => setRequests([]), []);

  return {
    loading,
    requests,
    setRequests,
    filter,
    setFilter,
    fetchRequests,
    hasMore,
  };
};
