import {
  AccommodationModel,
  AccommodationService,
  AccomRoomModel,
  ServiceCategoryModel,
} from '@models/accommodation';

export function getAccommodationById(
  accs: Array<AccommodationModel>,
  id: string,
): AccommodationModel | null {
  const index = accs.findIndex(acc => acc.id === id);
  if (index === -1) return null;
  return accs[index];
}

export function getRoomById(
  rooms: Array<AccomRoomModel>,
  id: string,
): AccomRoomModel | null {
  const index = rooms.findIndex(r => r.id === id);
  if (index === -1) return null;
  return rooms[index];
}

export function findServiceCategory(name: string, ss: ServiceCategoryModel[]) {
  const index = ss.findIndex(s => s.name === name);
  if (index !== -1) return ss[index];
  return null;
}

export function findAccommodationService(
  name: string,
  ss: AccommodationService[],
) {
  const index = ss.findIndex(s => s.name === name);
  if (index !== -1) return ss[index];
  return null;
}

export function isNumeric(value: string) {
  return /^\d+$/.test(value);
}
