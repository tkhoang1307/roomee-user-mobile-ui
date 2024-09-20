import {AccommodationActionEnum} from '@const/accomodation';
import {AccommodationModel} from '@models/accommodation';

export const initialState: AccommodationModel = {
  deleted: false,
  id: '',
  locationId: '',
  ownerId: '',
  name: '',
  floorNumber: -1,
  rooms: [],
  location: {
    id: '',
    street: '',
    ward: '',
    district: '',
    cityProvince: '',
    country: '',
    detail: '',
  },
  owner: {
    birthday: '',
    name: '',
    phoneNumber: '',
    username: '',
  },
  accommodationManagers: [],
  primaryServices: [],
  theme: '',
};

interface Action {
  type: string;
  payload?: any;
}

export default function CurAccomReducer(
  accommodation: AccommodationModel,
  action: Action,
) {
  const {type, payload} = action;
  switch (type) {
    case AccommodationActionEnum.SET_CURRENT_ACCOMMODATION:
      return payload;
    case AccommodationActionEnum.RESET_ACCOMMODATIONS:
      return initialState;
    default:
      return accommodation;
  }
}
