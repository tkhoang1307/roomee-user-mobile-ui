import {ContractEndPoints} from '@const/contract';
import {privateAxios} from '@libs/axios';
import {
  ContractModel,
  CreateContractModel,
  CreateContractRes,
  ExtendContractModel,
  GetContractsFilterModel,
  TerminateContractModel,
} from '@models/contract';

export const createContract = async (payload: CreateContractModel) => {
  const res = await privateAxios.post(
    ContractEndPoints.CREATE_CONTRACT,
    payload,
  );
  return res?.data as CreateContractRes;
};

export const getContracts = async (payload: GetContractsFilterModel) => {
  const res = await privateAxios.get(ContractEndPoints.GET_CONTRACTS, {
    params: payload,
  });
  return res?.data as ContractModel[];
};
export const getCurrentContract = async (roomId: string) => {
  const res = await privateAxios.get(ContractEndPoints.GET_CURRENT_CONTRACT, {
    params: {
      roomId,
    },
  });
  return res?.data as ContractModel;
};

export const retryGenerateContract = async (id: string) => {
  const res = await privateAxios.put(
    ContractEndPoints.CREATE_CONTRACT + `/${id}/retry`,
  );
  return res?.data as CreateContractRes;
};

export const getContractById = async (id: string) => {
  const res = await privateAxios.get(
    ContractEndPoints.GET_CONTRACTS + `/${id}`,
  );
  return res?.data as ContractModel;
};

export const terminateContract = async (
  contractId: string,
  payload: TerminateContractModel,
) => {
  const res = await privateAxios.put(
    ContractEndPoints.CONTRACT + `/${contractId}/terminate`,
    payload,
  );
  return res?.data as ContractModel;
};

export const extendContract = async (
  contractId: string,
  payload: ExtendContractModel,
) => {
  const res = await privateAxios.put(
    ContractEndPoints.CONTRACT + `/${contractId}/extend`,
    payload,
  );
  return res?.data as ContractModel;
};
