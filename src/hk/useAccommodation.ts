import {useContext, useEffect, useState} from 'react';

import {accommodationService} from '@services';
import {AccommodationModel} from '@models/accommodation';
import {AccommodationActionEnum} from '@const/accomodation';
import {CurAccomContext} from '@context';

export function useDetailAccommodation(accommodationId: string) {
  const [loadingAccommodation, setLoadingAccommodation] = useState(true);
  const {curAccom, curAccomDispatch} = useContext(CurAccomContext);
  const [resetFlag, setResetFlag] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const setAccommodation = (a: AccommodationModel) => {
    curAccomDispatch({
      type: AccommodationActionEnum.SET_CURRENT_ACCOMMODATION,
      payload: a,
    });
  };

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        setResetLoading(true);
        setLoadingAccommodation(true);
        const data = await accommodationService.getDetailAccommodation(
          accommodationId || '',
        );
        if (data) setAccommodation(data);
      } catch (error: any) {
      } finally {
        setResetLoading(false);
        setLoadingAccommodation(false);
      }
    };

    fetchAccommodation();
  }, [accommodationId, resetFlag]);

  return {
    accommodation: curAccom,
    setAccommodation: setAccommodation,
    loadingAccommodation,
    setLoadingAccommodation,
    resetFlag,
    setResetFlag,
    resetLoading,
    setResetLoading,
  };
}
