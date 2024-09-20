export enum ServiceEnum {
  WATER_COST = 'waterCost',
  WATER_UNIT = 'm3',
  ELECTRICITY_COST = 'electricityCost',
  ELECTRICITY_UNIT = 'kwh',
}

export enum AccommodationEndPoints {
  CREATE_ACCOMMODATION = '/api/accommodation',
  UPDATE_ACCOMMODATION = '/api/accommodation',
  DELETE_ACCOMMODATION = '/api/accommodation',
  GET_CURRENT_ACCOMMODATIONS = '/api/accommodation',
  GET_DETAIL_ACCOMMODATION = '/api/accommodation',
  GET_ALL_ROOM_ACCOMODATION = '/api/accommodation',
  GET_SERVICE_CATEGORY = '/api/service/category',
  GET_ACCOMMODATION_SERVICE = 'api/service',
}

export enum AccommodationActionEnum {
  SET_ACCOMMODATIONS = 'Set accommodations',
  UPDATE_ACCOMMODATION = 'Update accommodation',
  UPDATE_ACCOMMODATION_BY_ID = 'Update accommodation by id',
  UPDATE_FLOOR_NUMBER_ACCOMMODATION = 'Update floor number accommodation',
  RESET_ACCOMMODATIONS = 'Reset accommodations',
  CREATE_ACCOMMODATION = 'Create accommodation',
  DELETE_ACCOMMODATION = 'Delete accommodation',
  SET_CURRENT_ACCOMMODATION = 'Set current accommodation',
  SET_CURRENT_MAIN_ACCOMMODATION = 'Set current main accommodation',
  RESET_MAIN_ACCOMMODATION = 'Reset main accommodation',
  UPDATE_MAIN_ACCOMMODATION = 'Update main accommodation',
}

export enum PrimaryServiceEnum {
  WATER = 'water',
  ELECTRIC = 'electric',
}

export const AccommodationImageDefault =
  'https://www.shutterstock.com/image-vector/office-building-flat-design-concept-260nw-1707632011.jpg';

export enum AccommodationMenu {
  MANAGER = 'manager',
  ADDACCOMMODATION = 'addAcoommodation',
}

export const REGISTRATION_TEMPLATE_TYPE_NAME = 'tenant-registration-template';
