import {Alert, Image, ScrollView, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {useForm, Controller} from 'react-hook-form';

import {globalStyles} from '@styles';
import {
  ButtonImagePicker,
  InputComponent,
  LoadingScreenComponent,
  RowComponent,
  SectionComponent,
  SelectValueComponent,
  SpaceComponent,
  TitleComponent,
} from '@components/index';
import {accommodationService, locationService} from '@services';
import {LocationOptionsModel} from '@models/location';
import {
  FindLabelOfValueInSelectionOptions,
  FindValueOfLabelInSelectionOptions,
} from '@utils/array';
import {UpdateAccommodationModel} from '@models/accommodation';
import {LocationEnum} from '@const/location';
import {AccommodationsContext, MainAccommodationContext} from '@context';
import {AccommodationActionEnum} from '@const/accomodation';
import {useDetailAccommodation} from '@hk/useAccommodation';
import {ChangeInfoAccommodationScreenProps} from '@models/navigators/HomNavigator';
import {extractFileNameFromPath} from '@utils/extractFileNameFromPath';
import {Button} from '@ant-design/react-native';

interface FormValues {
  accommodationName: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  floorNumber: string;
}

const ChangeInfoAccommodationScreen: React.FC<
  ChangeInfoAccommodationScreenProps
> = ({navigation, route}) => {
  const {accommodation, setAccommodation} = useDetailAccommodation(
    route.params.accommodationInfor.id,
  );
  const {accommodationsDispatch} = useContext(AccommodationsContext);
  const {mainAccommodationDispatch} = useContext(MainAccommodationContext);
  const {accommodationInfor} = route.params;
  const {t} = useTranslation();
  const [loadingChangeInfor, setLoadingChangeInfor] = useState(false);

  const [province, setProvince] = useState<string>('');
  const [provinceOpts, setProvinceOpts] = useState<Array<LocationOptionsModel>>(
    [],
  );
  const [district, setDistrict] = useState<string>('');
  const [districtOpts, setDistrictOpts] = useState<Array<LocationOptionsModel>>(
    [],
  );
  const [ward, setWard] = useState<string>('');
  const [wardOpts, setWardOpts] = useState<Array<LocationOptionsModel>>([]);
  const [loadingProvince, setLoadingProvince] = useState(true);
  const [loadingDistrict, setLoadingDistrict] = useState(true);
  const [loadingWard, setLoadingWard] = useState(true);

  const [imageUpdate, setImageUpdate] = useState<string>();
  const [loadingUploadImage, setLoadingUploadImage] = useState<boolean>(false);

  const handleFileSelected = async (val: ImageOrVideo) => {
    setLoadingUploadImage(true);
    const basename = extractFileNameFromPath(val.path);
    const photo = {
      uri: val.path,
      type: val.mime,
      name: basename,
      size: val.size,
    };
    const formData = new FormData();
    formData.append('file', photo);
    try {
      const url = await accommodationService.uploadTheme(
        formData,
        route.params.accommodationInfor.id,
      );
      setImageUpdate(url);
      setAccommodation({...accommodation, theme: url});
      accommodationsDispatch({
        type: AccommodationActionEnum.UPDATE_ACCOMMODATION_BY_ID,
        payload: {
          updatedAcc: {
            ...accommodation,
            theme: url,
          },
          id: accommodation.id,
        },
      });
    } catch (error: any) {
      Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
        {
          text: t('actions.cancel'),
          style: 'cancel',
        },
      ]);
    } finally {
      setLoadingUploadImage(false);
    }
  };
  const {
    setValue,
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      accommodationName: accommodationInfor.name,
      province: '',
      district: '',
      ward: '',
      street: accommodationInfor.location.street ?? '',
      floorNumber: accommodationInfor.floorNumber.toString(),
    },
  });

  // console.log('ward', accommodationInfor.location.ward);

  const onSubmit = async (data: FormValues) => {
    setLoadingChangeInfor(true);

    const cityProvinceName = FindLabelOfValueInSelectionOptions(
      provinceOpts,
      province,
    );
    const districtName = FindLabelOfValueInSelectionOptions(
      districtOpts,
      district,
    );
    const wardName = FindLabelOfValueInSelectionOptions(wardOpts, ward);

    const payload: UpdateAccommodationModel = {
      name: data.accommodationName,
      country: LocationEnum.DEFAULT_COUNTRY,
      cityProvince: cityProvinceName,
      district: districtName,
      ward: wardName,
      street: data.street,
      floorNumber: parseInt(data.floorNumber),
    };
    try {
      await accommodationService.updateAccommodation(
        payload,
        accommodationInfor.id,
      );
      accommodationsDispatch({
        type: AccommodationActionEnum.UPDATE_ACCOMMODATION,
        payload: {
          updatedAcc: payload,
          id: accommodationInfor.id,
        },
      });
      if (route.params.isMainAccom) {
        mainAccommodationDispatch({
          type: AccommodationActionEnum.UPDATE_MAIN_ACCOMMODATION,
          payload: {
            location: payload,
            id: accommodationInfor.id,
          },
        });
      }
      const updatedAcc = {...accommodationInfor};
      updatedAcc.name = payload.name;
      updatedAcc.floorNumber = payload.floorNumber;
      updatedAcc.location = {
        ...updatedAcc.location,
        country: payload.country,
        cityProvince: payload.cityProvince,
        district: payload.district,
        ward: payload.ward,
        street: payload.street,
      };
      setAccommodation(updatedAcc);
      navigation.goBack();
    } catch (error: any) {
      Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
        {
          text: t('actions.verify'),
          style: 'cancel',
        },
      ]);
    } finally {
      setLoadingChangeInfor(false);
    }
  };

  useEffect(() => {
    const fetchProvinces = async () => {
      if (provinceOpts.length > 0) return;
      try {
        setLoadingProvince(true);
        const data = await locationService.getProvinces();
        const value = FindValueOfLabelInSelectionOptions(
          data,
          accommodationInfor.location.cityProvince,
        );
        setValue('province', value);
        setProvinceOpts(data);

        setProvince(value);
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
        setDistrict('');
        setWard('');
        setValue('district', '');
        setValue('ward', '');
        setDistrictOpts([]);
        setWardOpts([]);
        if (province) {
          const data = await locationService.getDistricts(province);
          setDistrictOpts(data);

          if (
            FindValueOfLabelInSelectionOptions(
              provinceOpts,
              accommodationInfor.location.cityProvince,
            ) === province
          ) {
            const value = FindValueOfLabelInSelectionOptions(
              data,
              accommodationInfor.location.district,
            );
            setDistrict(value);
            setValue('district', value);
          }
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
        setWard('');
        setValue('ward', '');
        setWardOpts([]);
        if (district) {
          const data = await locationService.getWards(district, province);
          setWardOpts(data);
          if (
            FindValueOfLabelInSelectionOptions(
              districtOpts,
              accommodationInfor.location.district,
            ) === district
          ) {
            const value = FindValueOfLabelInSelectionOptions(
              data,
              accommodationInfor.location.ward || '',
            );
            setWard(value);
            setValue('ward', value);
          }
        }
      } catch (error) {
      } finally {
        setLoadingWard(false);
      }
    };
    fetchWards();
  }, [district]);

  return (
    <View style={[globalStyles.container, {position: 'relative'}]}>
      <TitleComponent
        back
        title={t('screensTitle.editAccommodation')}
        titleStyle={{fontSize: 20, marginTop: -2}}
      />
      {loadingUploadImage && (
        <LoadingScreenComponent loading={loadingUploadImage} />
      )}
      <SpaceComponent height={10} />
      <SectionComponent styles={{flex: 1}}>
        <ScrollView>
          <RowComponent>
            <Image
              style={{
                width: '100%',
                height: 200,
                borderRadius: 10,
              }}
              source={
                imageUpdate
                  ? {uri: imageUpdate}
                  : accommodationInfor.theme
                  ? {
                      uri: accommodationInfor.theme,
                    }
                  : require('../../../../assets/images/various-houses.png')
              }
            />
          </RowComponent>
          <SpaceComponent height={16} />
          <RowComponent>
            <ButtonImagePicker
              cropCircle={false}
              onSelect={(val: any) => {
                handleFileSelected(val.value);
              }}
            />
          </RowComponent>
          <View>
            <Controller
              control={control}
              render={({field: {onChange, value}}) => (
                <InputComponent
                  label={t('label.accommodationName')}
                  placeholder={t('placeholders.accommodationName')}
                  allowClear
                  value={value}
                  // onBlur={onBlur}

                  onChange={val => onChange(val)}
                  errorMessage={errors.accommodationName?.message}
                />
              )}
              name="accommodationName"
              rules={{required: t('validation.accommodationNameRequired')}}
            />
            <Controller
              control={control}
              name="province"
              render={({field: {onChange, value}}) => (
                <SelectValueComponent
                  title={t('label.province')}
                  data={provinceOpts}
                  setValue={onChange}
                  setId={setProvince}
                  value={value}
                  require={true}
                  errorMessage={errors.province?.message}
                  loading={loadingProvince}
                />
              )}
              rules={{required: t('validation.provinceRequired')}}
            />
            <Controller
              control={control}
              name="district"
              render={({field: {onChange, value}}) => (
                <SelectValueComponent
                  title={t('label.district')}
                  data={districtOpts}
                  setValue={onChange}
                  setId={setDistrict}
                  value={value}
                  require={true}
                  errorMessage={errors.district?.message}
                  loading={loadingDistrict}
                />
              )}
              rules={{required: t('validation.districtRequired')}}
            />
            <Controller
              control={control}
              name="ward"
              render={({field: {onChange, value}}) => (
                <SelectValueComponent
                  title={t('label.ward')}
                  data={wardOpts}
                  setValue={onChange}
                  setId={setWard}
                  value={value}
                  // errorMessage={errorMessagesInfo.province}
                  loading={loadingWard}
                />
              )}
            />
            <Controller
              control={control}
              render={({field: {onChange, value}}) => (
                <InputComponent
                  label={t('label.street')}
                  placeholder={t('placeholders.street')}
                  allowClear
                  value={value}
                  // type="numeric"
                  onChange={val => onChange(val)}
                  errorMessage={errors.street?.message}
                />
              )}
              name="street"
              rules={{required: t('validation.streetRequired')}}
            />
            <Controller
              control={control}
              render={({field: {onChange, value}}) => (
                <InputComponent
                  label={t('label.floorNumber')}
                  placeholder={t('placeholders.floorNumber')}
                  allowClear
                  value={value}
                  type="numeric"
                  // onBlur={onBlur}

                  onChange={val => onChange(val)}
                  errorMessage={errors.floorNumber?.message}
                />
              )}
              name="floorNumber"
              rules={{required: t('validation.floorNumberRequired')}}
            />
          </View>
        </ScrollView>
        <Button
          loading={loadingChangeInfor}
          onPress={handleSubmit(onSubmit)}
          type="primary">
          {t('actions.update')}
        </Button>
      </SectionComponent>
    </View>
  );
};

export default ChangeInfoAccommodationScreen;
