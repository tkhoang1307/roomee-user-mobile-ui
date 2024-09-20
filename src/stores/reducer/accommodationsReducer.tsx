import {AccommodationActionEnum} from '@const/accomodation';
import {
  AccommodationModel,
  UpdateAccommodationModel,
} from '@models/accommodation';

export const initialState = [];

interface Action {
  type: string;
  payload?: any;
}

export default function AccommodationsReducer(
  accommodations: Array<AccommodationModel>,
  action: Action,
) {
  const {type, payload} = action;
  switch (type) {
    case AccommodationActionEnum.SET_ACCOMMODATIONS:
      return payload;
    case AccommodationActionEnum.CREATE_ACCOMMODATION:
      return [...accommodations, payload];
    case AccommodationActionEnum.UPDATE_ACCOMMODATION:
      const updatedAcc = payload.updatedAcc as UpdateAccommodationModel;
      const updatedAccId = payload.id as string;
      const updatedAccommodations = accommodations.map(a => {
        if (a.id === updatedAccId)
          return {
            ...a,
            name: updatedAcc.name,
            floorNumber: updatedAcc.floorNumber,
            location: {
              ...a.location,
              street: updatedAcc.street,
              ward: updatedAcc.ward,
              district: updatedAcc.district,
              cityProvince: updatedAcc.cityProvince,
              country: updatedAcc.country,
            },
          };
        return a;
      });
      return updatedAccommodations;
    case AccommodationActionEnum.UPDATE_ACCOMMODATION_BY_ID:
      const updatedAccom = payload.updatedAcc as AccommodationModel;
      const updatedAccomId = payload.id as string;
      const updatedAccoms = accommodations.map(a => {
        if (a.id === updatedAccomId)
          return {
            ...updatedAccom,
          };
        return a;
      });
      return updatedAccoms;
    case AccommodationActionEnum.UPDATE_FLOOR_NUMBER_ACCOMMODATION:
      const floorNumber = payload.floorNumber as number;
      const updatedFloorNumberAccommodations = accommodations.map(a => {
        if (a.id === payload.id)
          return {
            ...a,
            floorNumber: floorNumber,
          };
        return a;
      });
      return updatedFloorNumberAccommodations;
    case AccommodationActionEnum.DELETE_ACCOMMODATION:
      return accommodations.filter(x => x.id !== payload.id);
    case AccommodationActionEnum.RESET_ACCOMMODATIONS:
      return initialState;
    default:
      return accommodations;
  }
}
