import {ActivityIndicator, Alert, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {useTranslation} from 'react-i18next';

import {globalStyles} from '@styles';
import {
  ButtonComponent,
  ContainerComponent,
  InputComponent,
  SectionComponent,
  SpaceComponent,
  TitleComponent,
  UploadImageComponent,
} from '@components/index';
import {appColors} from '@const/appColors';
import {AddRoomScreenProps} from '@models/navigators/HomNavigator';
import FloorOptionsComponent from './components/FloorOptionsComponent';
import {CreateRoomPayloadModel, FormValues, IImageUri} from '@models/room';
import {useDetailAccommodation} from '@hk/useAccommodation';
import {roomService} from '@services';
import {AccommodationsContext} from '@context';
import {AccommodationActionEnum} from '@const/accomodation';

type OptionFloor = {
  value: string;
  label: string;
};

const AddRoomScreen: React.FC<AddRoomScreenProps> = ({navigation, route}) => {
  const floorNumber = route.params.floorNumber;
  const accommodationId = route.params.accommodationID;
  const {t} = useTranslation();
  const {accommodation, setAccommodation} =
    useDetailAccommodation(accommodationId);
  const {accommodationsDispatch} = useContext(AccommodationsContext);

  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [loadingChangeInfor, setLoadingChangeInfor] = useState<boolean>(false);
  const [optionsFloor, setOptionsFloor] = useState<OptionFloor[]>();
  const [listImage, setListImage] = useState<IImageUri[]>([]);

  const {
    setValue,
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      floor: '',
      roomName: '',
      area: '',
      maxRenters: '',
      rentalCost: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setCreateLoading(true);
    setLoadingChangeInfor(true);
    const formData = new FormData();
    listImage.map(photo => {
      formData.append('file', photo);
    });
    const payload: CreateRoomPayloadModel = {
      accommodationId: accommodation.id,
      name: data.roomName,
      area: parseFloat(data.area),
      floor: parseInt(data.floor),
      imagesUrl: [],
      maxRenters: parseInt(data.maxRenters),
      rentCost: parseInt(data.rentalCost),
    };
    try {
      const newRoom = await roomService.createNewRoom(payload);
      const uploadImgs = listImage.map(async (f): Promise<any> => {
        const bodyFormData = new FormData();
        bodyFormData.append('file', f);
        await roomService.pushRoomImage(bodyFormData, newRoom.id);
      });
      await Promise.all(uploadImgs);
      if (newRoom.floor > accommodation.floorNumber) {
        accommodationsDispatch({
          type: AccommodationActionEnum.UPDATE_FLOOR_NUMBER_ACCOMMODATION,
          payload: {
            id: accommodation.id,
            floorNumber: newRoom.floor,
          },
        });
        setAccommodation({
          ...accommodation,
          floorNumber: newRoom.floor,
        });
      }
      navigation.goBack();
    } catch (error: any) {
      Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
        {
          text: t('actions.cancel'),
          style: 'cancel',
        },
      ]);
    } finally {
      setCreateLoading(false);
      setLoadingChangeInfor(false);
    }
  };

  useEffect(() => {
    const floorOtps = Array.from(
      {length: floorNumber + 1},
      (_, i) => i + 1,
    ).map(floor => ({
      value: floor.toString(),
      label:
        floor === floorNumber + 1
          ? `${floor} (${t('label.newFloor')})`
          : floor.toString(),
    }));
    setValue('floor', floorOtps?.[0]?.value ?? '');
    setOptionsFloor(floorOtps);
  }, []);

  return (
    <View style={[globalStyles.container]}>
      <TitleComponent
        back
        title={t('actions.createRoom')}
        titleStyle={{fontSize: 20, marginTop: -2}}
        backgroundColor={appColors.white}
      />

      <SectionComponent
        styles={{backgroundColor: appColors.white, marginTop: 10, flex: 1}}>
        <ContainerComponent isScroll>
          {createLoading && <ActivityIndicator color={appColors.primary} />}
          <SpaceComponent height={16} />
          <View>
            <Controller
              control={control}
              render={({field: {onChange, value}}) => (
                <FloorOptionsComponent
                  title={t('label.floor')}
                  // placeholder={optionsFloor?.[0]?.label ?? ''}
                  value={value}
                  data={optionsFloor ?? []}
                  setValue={onChange}
                  // errorMessage={errors.floor?.message}
                />
              )}
              name="floor"
              // rules={{required: t('validation.floorRequired')}}
            />
            <Controller
              control={control}
              name="roomName"
              render={({field: {onChange, value}}) => (
                <InputComponent
                  label={t('placeholders.roomName')}
                  placeholder={t('placeholders.roomName')}
                  allowClear
                  value={value}
                  onChange={val => onChange(val)}
                  errorMessage={errors.roomName?.message}
                />
              )}
              rules={{required: t('validation.roomNameRequired')}}
            />
            <Controller
              control={control}
              name="area"
              render={({field: {onChange, value}}) => (
                <InputComponent
                  label={t('label.area')}
                  placeholder={t('placeholders.area')}
                  allowClear
                  value={value}
                  onChange={val => onChange(val)}
                  errorMessage={errors.area?.message}
                />
              )}
              rules={{required: t('validation.areaRequired')}}
            />
            <Controller
              control={control}
              name="maxRenters"
              rules={{required: t('validation.maxRentersRequired')}}
              render={({field: {onChange, value}}) => (
                <InputComponent
                  label={t('label.maxRenters')}
                  placeholder={t('placeholders.maxRenters')}
                  allowClear
                  value={value}
                  onChange={val => onChange(val)}
                  errorMessage={errors.maxRenters?.message}
                />
              )}
            />
            <Controller
              control={control}
              render={({field: {onChange, value}}) => (
                <InputComponent
                  label={t('label.rentalCost')}
                  placeholder={t('placeholders.rentalCost')}
                  allowClear
                  value={value}
                  type="numeric"
                  onChange={val => onChange(val)}
                  errorMessage={errors.rentalCost?.message}
                />
              )}
              name="rentalCost"
              rules={{required: t('validation.rentalCostRequired')}}
            />
            <UploadImageComponent
              listImageUri={listImage}
              setListImageUri={setListImage}
              maxImage={5}
              size={100}
            />
          </View>
        </ContainerComponent>
      </SectionComponent>
      <SectionComponent styles={{backgroundColor: appColors.white}}>
        <ButtonComponent
          loading={loadingChangeInfor}
          text={t('actions.submit')}
          onPress={handleSubmit(onSubmit)}
          type="primary"
          styles={{marginBottom: 0}}
        />
      </SectionComponent>
    </View>
  );
};

export default AddRoomScreen;
