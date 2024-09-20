import {View, Alert, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Controller, useForm} from 'react-hook-form';

import {EditRoomScreenProps} from '@models/navigators/HomNavigator';
import {roomService} from '@services';
import {
  ButtonComponent,
  ContainerComponent,
  InputComponent,
  SectionComponent,
  SpaceComponent,
  TitleComponent,
} from '@components/index';
import {globalStyles} from '@styles';
import {appColors} from '@const/appColors';
import {FormValues, UpdateRoomModel} from '@models/room';

const EditRoomScreen: React.FC<EditRoomScreenProps> = ({navigation, route}) => {
  const roomId = route.params.roomID;

  const {t} = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingChangeInfor, setLoadingChangeInfor] = useState<boolean>(false);

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
    setLoadingChangeInfor(true);
    const payload: UpdateRoomModel = {
      name: data.roomName,
      area: parseFloat(data.area),
      floor: parseInt(data.floor),
      maxRenters: parseInt(data.maxRenters),
      rentCost: parseInt(data.rentalCost),
      imagesUrl: [],
    };
    try {
      await roomService.updateGeneralInforRoom(payload, roomId!);
      navigation.goBack();
    } catch (error: any) {
      Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
        {
          text: t('actions.cancel'),
          style: 'cancel',
        },
      ]);
    } finally {
      setLoadingChangeInfor(false);
    }
  };

  useEffect(() => {
    const getRoomData = async () => {
      try {
        const data = await roomService.getDetailRoom(roomId);
        setValue('floor', data.floor.toString());
        setValue('roomName', data.name);
        setValue('area', data.area.toString());
        setValue('maxRenters', data.maxRenters?.toString() ?? '');
        setValue('rentalCost', data.rentCost?.toString() ?? '');
      } catch (error: any) {
        Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
          {
            text: t('actions.cancel'),
            style: 'cancel',
          },
        ]);
      }
    };

    getRoomData();
  }, [roomId]);

  return (
    <View style={[globalStyles.container]}>
      <TitleComponent
        back
        title={t('screensTitle.editRoom')}
        titleStyle={{fontSize: 20, marginTop: -2}}
        backgroundColor={appColors.white}
      />

      <SectionComponent
        styles={{backgroundColor: appColors.white, marginTop: 10, flex: 1}}>
        <ContainerComponent isScroll>
          {loading && <ActivityIndicator color={appColors.primary} />}
          <SpaceComponent height={16} />
          <View>
            <Controller
              control={control}
              render={({field: {onChange, value}}) => (
                <InputComponent
                  label={t('placeholders.floor')}
                  placeholder={t('placeholders.floor')}
                  allowClear
                  value={value}
                  onChange={val => onChange(val)}
                  errorMessage={errors.roomName?.message}
                />
              )}
              name="floor"
              rules={{required: t('validation.floorRequired')}}
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
          </View>
        </ContainerComponent>
      </SectionComponent>
      <SectionComponent styles={{backgroundColor: appColors.white}}>
        <ButtonComponent
          loading={loadingChangeInfor}
          text={t('actions.update')}
          onPress={handleSubmit(onSubmit)}
          type="primary"
          styles={{marginBottom: 0}}
        />
      </SectionComponent>
    </View>
  );
};

export default EditRoomScreen;
