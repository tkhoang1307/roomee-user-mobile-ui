import { privateAxios } from '@libs/axios';
import { dataSignUpManager } from '@models/auth';
import {
  UserDetailModel,
  UsersWithPagination as UsersWithPaginationRes,
} from '@models/user';
import { OwnerEndPoints } from '@const/owner';
import { UserConst } from '@const/index';

export const signupManagerAccount = async (dataSignUp: dataSignUpManager) => {
  const res = await privateAxios.post(
    OwnerEndPoints.SIGN_UP_MANAGER_ENDPOINT,
    dataSignUp
  );
  return res.data as UserDetailModel;
};

export const getAllManagersByOwner = async (page: number) => {
  const res = await privateAxios.get(OwnerEndPoints.GET_ALL_MANAGERS_BY_OWNER, {
    params: {
      take: UserConst.PAGE_SIZE,
      skip: (page - 1) * UserConst.PAGE_SIZE,
    },
  });
  return res.data as UsersWithPaginationRes;
};

export const lockManagerAccount = async (
  idManager: string,
  data: { locked: boolean }
) => {
  const res = await privateAxios.put(
    OwnerEndPoints.GET_MANAGER_BY_ID_AND_OWNER +
      idManager +
      OwnerEndPoints.OWNER_LOCK_MANAGER_ACCOUNT,
    data
  );
  return res.data as UserDetailModel;
};

export const getDetailManagerByOwner = async (idManager: string) => {
  const res = await privateAxios.get(
    OwnerEndPoints.GET_MANAGER_BY_ID_AND_OWNER + idManager
  );
  return res.data as UserDetailModel;
};
