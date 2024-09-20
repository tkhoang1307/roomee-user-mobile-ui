import {useEffect, useState} from 'react';

import {requestService} from '@services';
import {CommentModel, RequestModel} from '@models/request';

export const useDetailRequest = (id: string, r?: RequestModel) => {
  const [request, setRequest] = useState<RequestModel>();
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRequest = async () => {
    try {
      if (!r) setLoading(true);

      const res = await requestService.getRequestDetail({
        topicId: id,
      });
      if (res) setRequest({...res});
    } catch (error: any) {
      console.log('error :', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  return {
    loading,
    request,
    setRequest,
    fetchRequest,
    comments,
    setComments,
  };
};
