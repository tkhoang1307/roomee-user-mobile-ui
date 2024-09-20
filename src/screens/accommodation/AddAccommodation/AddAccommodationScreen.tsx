import {Alert, TouchableOpacity, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Icon} from '@ant-design/react-native';

import {globalStyles} from '@styles';
import {
  ButtonComponent,
  CircleProgressComponent,
  LoadingScreenComponent,
  SectionComponent,
  TextComponent,
} from '@components/index';
import {fontFamilies} from '@const/fontFamilies';
import {appColors} from '@const/appColors';
import AccommodationInfoStep from './components/AccommodationInfoStep';
import {LocationOptionsModel} from '@models/location';
import AccommodationServicesStep from './components/AccommodationServicesStep';
import {
  CreateAccommodationPayloadModel,
  RoomPayloadModel,
  ServiceCategoryModel,
  ServiceModel,
  ServicePayloadModel,
} from '@models/accommodation';
import {accommodationService, locationService} from '@services';
import {findServiceCategory} from '@utils/accommodation';
import {AccommodationActionEnum, PrimaryServiceEnum} from '@const/accomodation';
import {FindLabelOfValueInSelectionOptions} from '@utils/array';
import {LocationEnum} from '@const/location';
import {AccommodationsContext} from '@context';
import {AddAccommodationStyle} from './styles';
export interface ErrorsAccommodationInfo {
  accommodationName: string;
  province: string;
  district: string;
  street: string;
  area: string;
  floor: string;
  roomPerFloor: string;
}
type ErrorMessageInfoKey =
  | 'accommodationName'
  | 'province'
  | 'district'
  | 'street'
  | 'area'
  | 'floor'
  | 'roomPerFloor';
type ErrorMessageServiceKey = 'rentalCost' | 'waterCost' | 'electricCost';

const initError = {
  accommodationName: '',
  province: '',
  district: '',
  street: '',
  area: '',
  floor: '',
  roomPerFloor: '',
};

export interface ErrorsAccommodationServices {
  rentalCost: string;
  waterCost: string;
  electricCost: string;
}

const initErrorServices = {
  rentalCost: '',
  waterCost: '',
  electricCost: '',
};
const step = 2; // step for progress
const AddAccommodationScreen = ({navigation}: any) => {
  const {accommodationsDispatch} = useContext(AccommodationsContext);

  const {t} = useTranslation();
  const [current, setCurrent] = useState<number>(0);
  const [createLoading, setCreateLoading] = useState<boolean>(false);

  const [accommodationName, setAccommodationName] = useState<string>('');
  const [province, setProvince] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [ward, setWard] = useState<string>('');
  const [street, setStreet] = useState<string>('');
  const [area, setArea] = useState<string>('');
  const [floorNumber, setFloorNumber] = useState<string>('');
  const [roomsPerFloor, setRoomsPerFloor] = useState<string>('');

  const [provinceOpts, setProvinceOpts] = useState<LocationOptionsModel[]>([]);
  const [districtOpts, setDistrictOpts] = useState<LocationOptionsModel[]>([]);
  const [wardOpts, setWardOpts] = useState<LocationOptionsModel[]>([]);
  const [loadingProvince, setLoadingProvince] = useState(false);
  const [loadingDistrict, setLoadingDistrict] = useState(false);
  const [loadingWard, setLoadingWard] = useState(false);

  const [rentalCost, setRentalCost] = useState('');
  const [waterCost, setWaterCost] = useState('');
  const [waterUnit, setWaterUnit] = useState('');
  const [electricCost, setElectricCost] = useState('');

  const [errorSecondService, setErrorSecondService] = useState('');

  useEffect(() => {
    const fetchProvinces = async () => {
      if (provinceOpts.length > 0) return;
      try {
        setLoadingProvince(true);
        const data = await locationService.getProvinces();
        setProvinceOpts(data);
        setDistrictOpts([]);
        setWardOpts([]);
      } catch (error: any) {
        Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
          {
            text: t('actions.verify'),
            style: 'cancel',
          },
        ]);
      } finally {
        setLoadingProvince(false);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        setLoadingDistrict(true);
        if (province) {
          const data = await locationService.getDistricts(province);
          setDistrictOpts(data);
          //reset district and ward
          setDistrict('');
          setWard('');
          setWardOpts([]);
        }
      } catch (error) {
      } finally {
        setLoadingDistrict(false);
      }
    };
    fetchDistricts();
  }, [province]);

  useEffect(() => {
    const fetchWards = async () => {
      try {
        setLoadingWard(true);
        if (district) {
          const data = await locationService.getWards(district, province);
          setWardOpts(data);
          setWard('');
        }
      } catch (error) {
      } finally {
        setLoadingWard(false);
      }
    };
    fetchWards();
  }, [district]);

  const [errorMessagesInfo, setErrorMessagesInfo] =
    useState<ErrorsAccommodationInfo>(initError);

  const [errorMessagesServices, setErrorMessagesServices] =
    useState<ErrorsAccommodationServices>(initErrorServices);

  const [secondaryServices, setSecondarySerives] = useState<ServiceModel[]>([]);

  const [serviceCategories, setServiceCategories] = useState<
    ServiceCategoryModel[]
  >([]);

  function validateField(
    value: string | undefined,
    message: string,
  ): string | undefined {
    if (!value) {
      return t(message); // Use translation function
    }
    return undefined;
  }

  const handleNext = () => {
    const newErrorMessagesInfo: ErrorsAccommodationInfo = {
      ...errorMessagesInfo,
    };

    const errors = {
      accommodationName: validateField(
        accommodationName,
        'validation.accommodationNameRequired',
      ),
      province: validateField(province, 'validation.provinceRequired'),
      district: validateField(district, 'validation.districtRequired'),
      street: validateField(street, 'validation.streetRequired'),
      area: validateField(area, 'validation.areaRequired'),
      floor: validateField(floorNumber, 'validation.floorRequired'),
      roomPerFloor: validateField(
        roomsPerFloor,
        'validation.roomsPerFloorRequired',
      ),
    };

    let hasError = false;
    Object.entries(errors).forEach(([key, error]) => {
      if (error) {
        newErrorMessagesInfo[key as ErrorMessageInfoKey] = error;
        hasError = true;
      }
    });

    if (hasError) {
      setErrorMessagesInfo(newErrorMessagesInfo);
      return;
    }

    setCurrent(current + 1);
  };

  const handleCreate = () => {
    const newErrorMessagesInfo: ErrorsAccommodationServices = {
      ...errorMessagesServices,
    };
    let hasError = false;

    const serviceErrors = {
      rentalCost: validateField(rentalCost, 'validation.rentalCostRequired'),
      waterCost: validateField(waterCost, 'validation.waterCostRequired'),
      electricCost: validateField(
        electricCost,
        'validation.electricityCostRequired',
      ),
    };

    Object.entries(serviceErrors).forEach(([key, error]) => {
      if (error) {
        newErrorMessagesInfo[key as ErrorMessageServiceKey] = error;
        hasError = true;
      }
    });

    if (hasError) {
      setErrorMessagesServices(newErrorMessagesInfo);
      return false;
    }

    let hasErrorSecond = false;
    secondaryServices.forEach(service => {
      if (service.cost === '') {
        setErrorSecondService(t('validation.secondCostRequired'));
        hasErrorSecond = true;
      }
    });

    if (hasErrorSecond) {
      return false;
    }

    return true;
  };

  const onSubmitCreate = async () => {
    if (!handleCreate()) return;
    setCreateLoading(true);
    // const services = servicesForm.getFieldsValue();
    const roomNumbers = Array.from(
      {length: parseInt(floorNumber!) * parseInt(roomsPerFloor!)},
      (_, index) => index + 1,
    );
    const rooms: Array<RoomPayloadModel> = roomNumbers.flatMap(roomNumber => {
      const floor = Math.ceil(roomNumber / parseInt(roomsPerFloor!));
      const roomName =
        'P' +
        floor +
        (roomNumber - (floor - 1) * parseInt(roomsPerFloor!))
          .toString()
          .padStart(
            parseInt(roomsPerFloor!) < 10
              ? roomsPerFloor.length + 1
              : roomsPerFloor.length,
            '0',
          );

      return {
        floor: floor,
        name: roomName,
        rentCost: parseFloat(rentalCost),
        area: parseFloat(area!),
      };
    });

    const primaryServices: ServicePayloadModel[] = [];
    const waterService = findServiceCategory(
      PrimaryServiceEnum.WATER,
      serviceCategories,
    );
    const electricService = findServiceCategory(
      PrimaryServiceEnum.ELECTRIC,
      serviceCategories,
    );

    primaryServices.push({
      accommodationServiceCategoryId: waterService!.id,
      name: waterService!.name,
      unit: waterUnit,
      cost: parseFloat(waterCost),
    });
    primaryServices.push({
      accommodationServiceCategoryId: electricService!.id,
      name: electricService!.name,
      unit: electricService!.unit[0],
      cost: parseInt(electricCost),
    });

    const cityProvinceName = FindLabelOfValueInSelectionOptions(
      provinceOpts,
      province,
    );
    const districtName = FindLabelOfValueInSelectionOptions(
      districtOpts,
      district,
    );
    const wardName = FindLabelOfValueInSelectionOptions(wardOpts, ward);
    const secondService = secondaryServices.map(service => {
      return {
        accommodationServiceCategoryId: service.accommodationServiceCategoryId,
        name: service.name,
        unit: service.unit,
        cost: parseFloat(service.cost),
      };
    });
    const payload: CreateAccommodationPayloadModel = {
      name: accommodationName,
      country: LocationEnum.DEFAULT_COUNTRY,
      cityProvince: cityProvinceName,
      district: districtName,
      ward: wardName,
      street: street,
      floorNumber: parseInt(floorNumber),
      rooms: rooms,
      services: {
        primaryServices,
        secondaryServices: secondService,
      },
    };

    try {
      const newAccommodation = await accommodationService.createAccommodation(
        payload,
      );
      accommodationsDispatch({
        type: AccommodationActionEnum.CREATE_ACCOMMODATION,
        payload: newAccommodation,
      });
      navigation.navigate('DetailAccommodationScreen', {
        accommodationInfor: newAccommodation,
      });
    } catch (error: any) {
      Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
        {
          text: t('actions.cancel'),
          style: 'cancel',
        },
      ]);
    } finally {
      setCreateLoading(false);
    }
  };

  useEffect(() => {
    const fetchServiceCategories = async () => {
      try {
        const data = await accommodationService.getServiceCategories();
        const waterService = findServiceCategory('water', serviceCategories);
        setWaterUnit(waterService?.unit[0] || '');
        setServiceCategories(data);
      } catch (error: any) {}
    };
    fetchServiceCategories();
  }, []);

  return (
    <View style={globalStyles.container}>
      <SectionComponent styles={[AddAccommodationStyle.sectionTitleStyle]}>
        <TouchableOpacity
          style={{position: 'absolute', left: 15, top: '40%', zIndex: 99}}>
          <Icon
            name="arrow-left"
            size={28}
            onPress={() => navigation.goBack()}
            style={{color: appColors.white}}
          />
        </TouchableOpacity>
        <TextComponent
          font={fontFamilies.bold}
          styles={[AddAccommodationStyle.titleStyle]}
          title
          text={t('pageTitle.addAccommodation')}
        />
      </SectionComponent>
      {/* <SpaceComponent height={20} /> */}
      <SectionComponent styles={[AddAccommodationStyle.sectionStepStyle]}>
        <View style={[AddAccommodationStyle.viewStepStyle]}>
          <View>
            {current === 0 && (
              <>
                <TextComponent
                  text={t('step.createAccommodation.info')}
                  size={20}
                  styles={{fontFamily: fontFamilies.bold}}
                />
                <TextComponent text={t('step.createAccommodation.nextStep')} />
              </>
            )}
            {current === step - 1 && (
              <>
                <TextComponent
                  text={t('step.createAccommodation.addServices')}
                  size={20}
                  styles={{fontFamily: fontFamilies.bold}}
                />
                <TextComponent text="" />
              </>
            )}
          </View>
          <CircleProgressComponent
            progress={((current + 1) * 100) / step}
            size={80}
            circleColor={appColors.primary}
            strokeWidth={10}
            step={2}
            current={current + 1}
          />
        </View>
      </SectionComponent>
      {createLoading && <LoadingScreenComponent loading={createLoading} />}

      <SectionComponent styles={{flex: 1}}>
        <View style={{flex: 20, marginTop: 10}}>
          {current === 0 ? (
            <AccommodationInfoStep
              provinceOpts={provinceOpts}
              districtOpts={districtOpts}
              wardOpts={wardOpts}
              province={province}
              setProvince={setProvince}
              district={district}
              setDistrict={setDistrict}
              ward={ward}
              setWard={setWard}
              accommodationName={accommodationName}
              setAccommodationName={setAccommodationName}
              street={street}
              setStreet={setStreet}
              area={area}
              setArea={setArea}
              floorNumber={floorNumber}
              setFloorNumber={setFloorNumber}
              roomsPerFloor={roomsPerFloor}
              setRoomsPerFloor={setRoomsPerFloor}
              errorMessagesInfo={errorMessagesInfo}
              setErrorMessagesInfo={setErrorMessagesInfo}
              loadingProvince={loadingProvince}
              loadingDistrict={loadingDistrict}
              loadingWard={loadingWard}
            />
          ) : (
            <AccommodationServicesStep
              setSecondarySerives={setSecondarySerives}
              secondaryServices={secondaryServices}
              serviceCategories={serviceCategories}
              rentalCost={rentalCost}
              waterCost={waterCost}
              electricCost={electricCost}
              waterUnit={waterUnit}
              setRentalCost={setRentalCost}
              setWaterCost={setWaterCost}
              setElectricCost={setElectricCost}
              setWaterUnit={setWaterUnit}
              errorMessagesServices={errorMessagesServices}
              setErrorMessages={setErrorMessagesServices}
              errorSecondService={errorSecondService}
              setErrorSecondService={setErrorSecondService}
            />
          )}
        </View>
        <View
          style={
            current > 0
              ? AddAccommodationStyle.viewActionStyle
              : AddAccommodationStyle.viewActionStyleFirstStep
          }>
          {current > 0 && (
            <ButtonComponent
              type="primary"
              text={t('actions.previous')}
              styles={[AddAccommodationStyle.buttonPreviousStyle]}
              textColor={appColors.text}
              onPress={() => setCurrent(prev => prev - 1)}
            />
          )}
          {current < step - 1 && (
            <ButtonComponent
              text={t('actions.next')}
              type="primary"
              styles={[
                current === 0
                  ? AddAccommodationStyle.buttonNextStyleFirstStep
                  : AddAccommodationStyle.buttonNextStyle,
              ]}
              textStyles={{textAlign: 'left'}}
              onPress={() => handleNext()}
            />
          )}
          {current === step - 1 && (
            <ButtonComponent
              text={t('actions.createAccommodation')}
              type="primary"
              styles={[AddAccommodationStyle.buttonAddStyle]}
              onPress={() => {
                onSubmitCreate();
              }}
            />
          )}
        </View>
      </SectionComponent>
    </View>
  );
};

export default AddAccommodationScreen;
