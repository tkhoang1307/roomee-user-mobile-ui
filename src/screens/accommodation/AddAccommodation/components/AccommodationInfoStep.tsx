import {useTranslation} from 'react-i18next';
import {ScrollView, View} from 'react-native';

import {LocationOptionsModel} from '@models/location';
import {
  InputComponent,
  SelectValueComponent,
  TextComponent,
} from '@components/index';
import {ErrorsAccommodationInfo} from '../AddAccommodationScreen';
import {isNumeric} from '@utils/accommodation';

interface AccommodationInfoStepProps {
  provinceOpts: LocationOptionsModel[];
  districtOpts: LocationOptionsModel[];
  wardOpts: LocationOptionsModel[];
  province: string;
  setProvince: React.Dispatch<React.SetStateAction<string>>;
  district: string;
  setDistrict: React.Dispatch<React.SetStateAction<string>>;
  ward: string;
  setWard: React.Dispatch<React.SetStateAction<string>>;
  accommodationName: string;
  setAccommodationName: React.Dispatch<React.SetStateAction<string>>;
  street: string;
  setStreet: React.Dispatch<React.SetStateAction<string>>;
  area: string;
  setArea: React.Dispatch<React.SetStateAction<string>>;
  floorNumber: string;
  setFloorNumber: React.Dispatch<React.SetStateAction<string>>;
  roomsPerFloor: string;
  setRoomsPerFloor: React.Dispatch<React.SetStateAction<string>>;
  errorMessagesInfo: ErrorsAccommodationInfo;
  setErrorMessagesInfo: React.Dispatch<
    React.SetStateAction<ErrorsAccommodationInfo>
  >;
  loadingProvince: boolean;
  loadingDistrict: boolean;
  loadingWard: boolean;
}

const AccommodationInfoStep: React.FC<AccommodationInfoStepProps> = ({
  provinceOpts,
  districtOpts,
  wardOpts,
  province,
  setProvince,
  district,
  setDistrict,
  ward,
  setWard,
  accommodationName,
  setAccommodationName,
  street,
  setStreet,
  area,
  setArea,
  floorNumber,
  setFloorNumber,
  roomsPerFloor,
  setRoomsPerFloor,
  errorMessagesInfo,
  setErrorMessagesInfo,
  loadingProvince,
  loadingDistrict,
  loadingWard,
}) => {
  const {t} = useTranslation();

  return (
    <ScrollView>
      <View>
        <InputComponent
          label={t('label.accommodationName')}
          value={accommodationName}
          onChange={value => {
            setAccommodationName(value);
            setErrorMessagesInfo(prevValues => ({
              ...prevValues,
              ['accommodationName']: '',
            }));
          }}
          placeholder={t('placeholders.accommodationName')}
          require={true}
          errorMessage={errorMessagesInfo.accommodationName}
        />
      </View>

      <SelectValueComponent
        wallet={false}
        title={t('label.province')}
        data={provinceOpts}
        setValue={setProvince}
        setId={setProvince}
        value={province}
        require={true}
        onChange={() => {
          setErrorMessagesInfo(prevValues => ({
            ...prevValues,
            ['province']: '',
          }));
        }}
        errorMessage={errorMessagesInfo.province}
        loading={loadingProvince}
      />
      <SelectValueComponent
        wallet={false}
        title={t('label.district')}
        data={districtOpts}
        setValue={setDistrict}
        setId={setDistrict}
        value={district}
        require={true}
        onChange={() => {
          setErrorMessagesInfo(prevValues => ({
            ...prevValues,
            ['district']: '',
          }));
        }}
        errorMessage={errorMessagesInfo.district}
        loading={loadingDistrict}
      />
      <SelectValueComponent
        wallet={false}
        title={t('label.ward')}
        data={wardOpts}
        setValue={setWard}
        setId={setWard}
        value={ward}
        loading={loadingWard}
      />
      <View>
        <InputComponent
          label={t('label.street')}
          placeholder={t('placeholders.street')}
          value={street}
          require={true}
          onChange={value => {
            setStreet(value);
            setErrorMessagesInfo(prevValues => ({
              ...prevValues,
              ['street']: '',
            }));
          }}
          errorMessage={errorMessagesInfo.street}
        />
      </View>
      <View>
        <InputComponent
          label={t('label.area')}
          placeholder={t('placeholders.area')}
          type="numeric"
          value={area}
          onChange={value => {
            if (value === '') {
              setArea(value);
            }
            if (isNumeric(value)) {
              setArea(value);
              setErrorMessagesInfo(prevValues => ({
                ...prevValues,
                ['area']: '',
              }));
            }
          }}
          errorMessage={errorMessagesInfo.area}
          require={true}
          suffix={<TextComponent size={16}>m²</TextComponent>}
        />
      </View>
      <View>
        <InputComponent
          label={t('label.floorNumber')}
          placeholder={t('placeholders.floorNumber')}
          type="numeric"
          value={floorNumber}
          onChange={value => {
            if (value === '') {
              setFloorNumber(value);
            }
            if (isNumeric(value)) {
              setFloorNumber(value);
              setErrorMessagesInfo(prevValues => ({
                ...prevValues,
                ['floor']: '',
              }));
            }
          }}
          errorMessage={errorMessagesInfo.floor}
          require={true}
        />
      </View>
      <View>
        <InputComponent
          label={t('label.roomsPerFloor')}
          placeholder={t('placeholders.roomsPerFloor')}
          type="numeric"
          value={roomsPerFloor}
          onChange={value => {
            if (value === '') {
              setRoomsPerFloor('');
            }
            if (isNumeric(value)) {
              setRoomsPerFloor(value);
              setErrorMessagesInfo(prevValues => ({
                ...prevValues,
                ['roomPerFloor']: '',
              }));
            }
          }}
          errorMessage={errorMessagesInfo.roomPerFloor}
          require={true}
        />
      </View>
    </ScrollView>
  );
};

export default AccommodationInfoStep;
