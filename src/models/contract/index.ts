import {ContractStateEnum} from '@const/contract';
import {TenantModel} from '@models/tenant';

export interface ServiceContractModel {
  name: string;
  unit: string;
  cost: number;
  type: 'PRIMARY' | 'SECONDARY';
}

export interface CreateContractControl {
  startDate: Date;
  endDate: Date;
  deposit: string;
  rentalCost: string;
  water: string;
  electric: string;
  template: string;
}

export interface CreateContractModel {
  roomId: string;
  startDate: Date;
  endDate: Date;
  templateType: string;
  templateExt: string;
  provisions: string[];
  roomTenantServices: ServiceContractModel[];
  tenancyDeposit: number;
}

export interface CreateContractRes extends CreateContractModel {
  id: string;
}

export interface GetContractsFilterModel {
  accommodationId: string;
  roomId?: string;
  startDate?: number;
  endDate?: number;
  state?: string;
}

export interface RoomModel {
  id: string;
  accommodationId: string;
  name: string;
  area: number;
  maxRenters?: number;
  imagesUrl: string[];
  rentCost: number;
  floor: number;
  deleted: boolean;
  updatedAt: Date;
  createdAt: Date;
}

export interface AccommodationContractModel {
  id: string;
  name: string;
}

export interface RoomContractModel {
  id: string;
  accommodationId: string;
  name: string;
  accommodation: AccommodationContractModel;
}

export interface ContractModel {
  id: string;
  roomId: string;
  state: ContractStateEnum;
  startDate: Date;
  endDate: Date;
  provisions: [];
  primaryServices: ServiceContractModel[];
  tenancyDeposit: number;
  templateType: string;
  templateExt: string;
  templateUrl: string;
  deleted: boolean;
  updatedAt: Date;
  createdAt: Date;
  room: RoomContractModel;
  tenants?: TenantModel[];
  isRefundDeposit?: boolean;
  isCheckedProperties?: boolean;
}

export interface ContractTableModel extends ContractModel {
  key: string;
}

export interface TerminateContractModel {
  isRefundDeposit: boolean;
  isCheckedProperties: boolean;
}

export interface ExtendContractModel {
  endDate: Date;
  roomTenantServices: ServiceContractModel[];
}

export interface ExtendContractControl {
  endDate: Date;
  rentalCost: string;
  water: string;
  electric: string;
}
