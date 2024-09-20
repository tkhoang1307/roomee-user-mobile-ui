export interface CreateRoomPayloadModel {
  accommodationId: string;
  name: string;
  area: number;
  maxRenters?: number;
  imagesUrl?: string[];
  floor: number;
  rentCost: number;
}

export interface DataCreateReturnModel extends CreateRoomPayloadModel {
  id: string;
}

export interface GeneralInforRoomModel {
  id: string;
  accommodationId: string;
  name: string;
  area: number;
  maxRenters?: number;
  floor: number;
  rentCost: number;
  imagesUrl: string[];
  deleted: boolean;
  createdAt: Date;
}

export interface UpdateRoomModel {
  name: string;
  area: number;
  maxRenters?: number;
  floor: number;
  rentCost: number;
  imagesUrl: string[];
}

export interface IImageUri {
  uid: string;
  uri: string;
  name?: string;
  type?: string;
  size?: number;
}

export interface FormValues {
  floor: string;
  roomName: string;
  area: string;
  maxRenters: string;
  rentalCost: string;
}

export interface PropertyStatusModel {
  label: string;
  value: string;
}

export interface RoomPropertyPayloadModel {
  roomId: string;
  name: string;
  quantity: number;
  status: string;
  notes: string;
}

export interface RoomPropertyModel extends RoomPropertyPayloadModel {
  id: string;
}

export interface RoomPropertyUpdateModel
  extends Partial<Omit<RoomPropertyPayloadModel, 'roomId'>> {}
