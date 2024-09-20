import {useContext, useState} from 'react';
import {ImageOrVideo} from 'react-native-image-crop-picker';

import {requestService} from '@services';
import {RequestsContext} from '@context';
import {RequestType} from '@models/request';

interface useCreateRequestProps {
  roomId: string;
  type: string;
  meta?: any;
  description: string;
  imgs?: ImageOrVideo[];
}

const useCreateRequest = () => {
  const {setRequests} = useContext(RequestsContext);
  const [loadingCreate, setLoadingCreate] = useState(false);

  const createRequest = async ({
    type,
    roomId,
    meta,
    description,
    imgs,
  }: useCreateRequestProps) => {
    try {
      setLoadingCreate(true);
      let rqId = '';

      if (type === RequestType.ROOM_REPAIR) {
        const newRequest = await requestService.createServiceRoomRepairRequest({
          roomId: roomId,
          payload: {
            description: description,
            expense: meta?.expense || 0,
            roomProperties: meta?.roomProperties || [],
          },
        });
        rqId = newRequest.id;
        setRequests(prev => [newRequest, ...prev]);
      }
      if (type === RequestType.SERVICE) {
        const newRequest =
          await requestService.createServiceRegistrationRequest({
            roomId: roomId,
            payload: {
              description: description,
              accommodationServiceIds: [...meta?.accommodationServiceIds] || [],
            },
          });
        rqId = newRequest.id;
        setRequests(prev => [newRequest, ...prev]);
      }
      if (type === RequestType.OTHERS) {
        const newRequest = await requestService.createServiceOtherRequest({
          roomId: roomId,
          payload: {
            description: description,
          },
        });
        rqId = newRequest.id;
        setRequests(prev => [newRequest, ...prev]);
      }

      if (imgs) {
        await Promise.all(
          imgs.map(async f => {
            const bodyFormData = new FormData();

            const tokens = f.path.split('/') || ['dummy'];
            const fileName = tokens[tokens.length - 1] || 'dummy';

            bodyFormData.append('file', {
              uri: f.path,
              type: f.mime,
              size: f.size,
              name: fileName,
            });

            return await requestService.createRequestAttachments({
              topicId: rqId,
              payload: bodyFormData,
            });
          }),
        );
      }
    } catch (error: any) {
      console.log(error?.response?.data.message);
    } finally {
      setLoadingCreate(false);
    }
  };

  return {
    loadingCreate,
    createRequest,
  };
};

export default useCreateRequest;
