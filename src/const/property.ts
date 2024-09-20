export enum RoomPropertyEndpoints {
  CREATE_ROOM_PROPERTY = '/api/property',
  UPDATE_ROOM_PROPERTY = '/api/property',
  GET_ALL_ROOM_PROPERTY = '/api/property/room',
  DELETE_ROOM_PROPERTY = '/api/property',
}

export enum PropertyStatus {
  GOOD = 'GOOD',
  DAMAGE = 'DAMAGE',
  MISSING = 'MISSING',
  REPAIRING = 'REPAIRING',
}
