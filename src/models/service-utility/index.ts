export interface ServiceCategoryModel {
    id: string;
    name: string;
    unit: Array<string>;
    label?: string;
    value?: string;
}

export interface UnitModel {
    label: string;
    value: string;
}

export interface CreationServiceAccommodationRequestModel {
    name: string;
    unit: string;
    cost: number;
    accommodationServiceCategoryId: string;
    accommodationId: string;
}

export interface ServiceAccommodationResponseModel {
    id: string;
    accommodationId: string;
    name: string;
    unit: string;
    cost: number;
    accommodationServiceCategoryId: string;
    type: string;
    label: string;
    value: string;
}

export interface UpdationServiceAccommodationRequestModel {
    unit: string;
    cost: number;
    accommodationServiceId: string;
    accommodationId: string;
}

export interface CreationServiceRoomRequestModel {
    accommodationServiceId: string;
    roomId: string;
}

export interface ServiceRoomResponseModel {
    id: string;
    name: string;
    unit: string;
    cost: number;
    type: string;
    deleted: boolean;
    contractId: string;
    label: string;
    value: string;
}

export interface UpdationServiceRoomRequestModel {
    roomServiceId: string;
    roomId: string;
    deleted: boolean;
}

export interface ErrorsServiceInfo {
    nameService: string;
    unit: string;
    cost: string;
}