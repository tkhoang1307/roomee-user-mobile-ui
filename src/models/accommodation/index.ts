import {PaymentMethodModel} from '@models/payment';

export interface RoomPayloadModel {
  floor: number;
  name: string;
  rentCost: number;
  area: number;
}

export interface ServicePayloadModel {
  name: string;
  unit: string;
  cost: number;
  accommodationServiceCategoryId: string;
}

export interface ServiceModel {
  name: string;
  unit: string;
  cost: string;
  accommodationServiceCategoryId: string;
}

export interface CreateAccommodationPayloadModel {
  name: string;
  country: string;
  cityProvince: string;
  district: string;
  ward: string;
  street: string;
  floorNumber: number;
  rooms: Array<RoomPayloadModel>;
  services: {
    primaryServices: Array<ServicePayloadModel>;
    secondaryServices: Array<ServicePayloadModel>;
  };
}

export interface AccomRoomModel {
  id: string;
  accommodationId: string;
  name: string;
  area: number;
  maxRenters?: number;
  imagesUrl?: Array<string>;
  rentCost: number;
  floor: number;
  _count: {
    contractTenants: number;
  };
  tenants: number;
}

export interface LocationModel {
  id: string;
  street: string;
  ward?: string;
  district: string;
  cityProvince: string;
  country: string;
  detail: string;
}

export interface AccommodationService {
  id: string;
  name: string;
  unit: string;
  cost: number;
  accommodationServiceCategoryId: string;
  type: string;
}

export interface AccommodationModel {
  deleted: boolean;
  id: string;
  locationId: string;
  ownerId: string;
  name: string;
  floorNumber: number;
  rooms?: Array<AccomRoomModel>;
  location: LocationModel;
  accommodationManagers?: Array<number>;
  owner: OwnerModel;
  primaryServices?: AccommodationService[];
  theme: string;
}

export interface FloorModel {
  floor: number;
  rooms: Array<AccomRoomModel>;
}

export interface OwnerModel {
  birthday?: string;
  name?: string;
  phoneNumber: string;
  username: string;
  imageUrl?: string;
  UserPaymentMethod?: PaymentMethodModel[];
}

export interface UpdateAccommodationModel {
  name: string;
  floorNumber: number;
  country: string;
  cityProvince: string;
  district: string;
  ward: string;
  street: string;
}

export interface GroupedRoomsModel {
  floor: string;
  rooms: AccomRoomModel[];
}

export interface ServiceCategoryModel {
  id: string;
  name: string;
  unit: string[];
}

export interface ContractTemplateModel {
  id: string;
  accommodationId: string;
  name: string;
  type: string;
  settings: {
    ext: string;
    rules: string[];
    downloader: string;
    templateUrl: string;
  };
  updatedAt: Date;
  createdAt: Date;
}

export interface ReponseRegistrationTemplateModel {
  id: string;
  accommodationId: string;
  roomId: string;
  name: string;
  type: string;
  settings: {
    label: string;
    templateUrl: string;
  };
  enabled: boolean;
  updatedAt: Date;
  createdAt: Date;
}
