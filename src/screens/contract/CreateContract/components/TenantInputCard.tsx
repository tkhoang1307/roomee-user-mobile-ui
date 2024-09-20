import {
  Control,
  Controller,
  FieldErrors,
  UseFormSetValue,
} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import React, {useEffect, useState} from 'react';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {ImageOrVideo} from 'react-native-image-crop-picker';

import {roomService} from '@services';
import {UserConst} from '@const/index';
import {appColors} from '@const/appColors';
import {convertDDMMYYYtoDate} from '@utils/date';
import {normalizeStr} from '@utils/stringHelpers';
import RowComponent from '@components/RowComponent';
import TextComponent from '@components/TextComponent';
import InputComponent from '@components/InputComponent';
import SpaceComponent from '@components/SpaceComponent';
import {CreateTenantInputControl} from '@models/tenant';
import DateTimePicker from '@components/DatetimePicker';
import ButtonImagePicker from '@components/ButtomImagePicker';
import IdentityCardImage from '@components/IdentityCardImage';
import ExtractImageLoadingMask from '@components/ExtractImageLoadingMask';

interface TenantInputCardProps {
  control: Control<
    {
      tenants: CreateTenantInputControl[];
    },
    any
  >;
  errors: FieldErrors<{
    tenants: CreateTenantInputControl[];
  }>;
  index: number;
  setValue: UseFormSetValue<{
    tenants: CreateTenantInputControl[];
  }>;
  roomId: string;
}

const TenantInputCard: React.FC<TenantInputCardProps> = ({
  control,
  errors,
  index,
  setValue,
  roomId,
}) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);
  const [firstLoadImg, setFirstLoadImg] = useState(true);
  const [extractImgsFlag, setExtractImgsFlag] = useState(false);
  const [frontImage, setFrontImage] = useState<ImageOrVideo>();
  const [behindImage, setBehindImage] = useState<ImageOrVideo>();
  const tenant = control._getFieldArray('tenants')[
    index
  ] as CreateTenantInputControl;
  const [frontImgUrl, setFrontImgUrl] = useState(tenant.imageUrlFront);
  const [behindImgUrl, setBehindImgUrl] = useState(tenant.imageUrlBehind);

  useEffect(() => {
    if (!tenant.imageUrlFront) setExtractImgsFlag(true);
  }, []);

  useEffect(() => {
    const handleExtractImage = async () => {
      setLoading(true);
      const bodyFormData = new FormData();
      bodyFormData.append('imageFront', {
        uri: frontImage?.path,
        type: frontImage?.mime,
        name: 'front',
        size: frontImage?.size,
      });
      bodyFormData.append('imageBehind', {
        uri: behindImage?.path,
        type: behindImage?.mime,
        name: 'behind',
        size: behindImage?.size,
      });
      try {
        const data: any = await roomService.getDataFromIdCard(
          bodyFormData,
          roomId,
        );

        Object.keys(data).forEach(key => {
          if (key === 'birthday')
            setValue(
              `tenants.${index}.birthday`,
              convertDDMMYYYtoDate(data[key]),
            );
          else if (key === 'type') setValue(`tenants.${index}.type`, data[key]);
          else if (key.includes('image'))
            setValue(`tenants.${index}.${key}` as any, data[key]);
          else if (key.includes('expiredTime')) {
            if ((data[key] as string).includes('/'))
              setValue(
                `tenants.${index}.${key}` as any,
                (data[key] as string).replace(/[^0-9/]/g, ''),
              );
            else
              setValue(
                `tenants.${index}.${key}` as any,
                normalizeStr(data[key], true),
              );
          } else if (key.includes('Residence') || key.includes('residence')) {
            let re = (data[key] as string)?.replace('Residence', '') || '';
            re = re.replace('residence', '');
            re = re.replace('.', '');
            setValue(`tenants.${index}.${key}` as any, normalizeStr(re));
          } else
            setValue(`tenants.${index}.${key}` as any, normalizeStr(data[key]));
        });
        setExtractImgsFlag(false);
      } catch (error: any) {
        Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
          {
            text: t('actions.cancel'),
            style: 'cancel',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (behindImage && frontImage) {
      // extract data from image
      if (extractImgsFlag) {
        handleExtractImage();
      }
    } else {
      if (!firstLoadImg) {
        if (!frontImage) {
          setExtractImgsFlag(true);
        }
        if (!behindImage) {
          setExtractImgsFlag(true);
        }
      }
    }
    setFirstLoadImg(false);
  }, [frontImage, behindImage]);

  return (
    <>
      {/* image */}
      <View style={{marginBottom: -8}}>
        <View style={{flexDirection: 'row'}}>
          <TextComponent text={t('label.idCardImg') + ':'} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 8,
            justifyContent: 'space-evenly',
          }}>
          {/* front */}
          <View>
            <RowComponent>
              <IdentityCardImage
                imageUrl={frontImgUrl ? frontImgUrl : undefined}
                name={t('label.emptyImg')}
                size={100}
              />
            </RowComponent>
            <SpaceComponent height={4} />
            <RowComponent>
              <ButtonImagePicker
                onSelect={(val: any) => {
                  setFrontImage(val.value);
                  setFrontImgUrl((val.value as ImageOrVideo).path);
                  setExtractImgsFlag(true);

                  if (extractImgsFlag === false) {
                    setBehindImage(undefined);
                    setBehindImgUrl('');
                  }
                }}
                title={t('actions.selectImage')}
                cropCircle={false}
              />
            </RowComponent>
          </View>
          {/* back */}
          <View>
            <RowComponent>
              <IdentityCardImage
                imageUrl={behindImgUrl ? behindImgUrl : undefined}
                name={t('label.emptyImg')}
                size={100}
              />
            </RowComponent>
            <SpaceComponent height={4} />
            <RowComponent>
              <ButtonImagePicker
                onSelect={(val: any) => {
                  setBehindImage(val.value);
                  setBehindImgUrl((val.value as ImageOrVideo).path);
                  setExtractImgsFlag(true);

                  if (extractImgsFlag === false) {
                    setFrontImage(undefined);
                    setFrontImgUrl('');
                  }
                }}
                title={t('actions.selectImage')}
                cropCircle={false}
              />
            </RowComponent>
          </View>
        </View>
      </View>
      {/* type of id card */}
      <Controller
        name={`tenants.${index}.type`}
        control={control}
        rules={{
          required: true,
        }}
        render={({field}) => (
          <View style={{marginBottom: 16}}>
            <View style={{flexDirection: 'row'}}>
              <Icon
                name="asterisk"
                size={8}
                color={appColors.danger}
                style={{paddingTop: 3, marginRight: 4}}
              />
              <TextComponent
                text={t('tenantInfomation.typeOfIdCard') + ':'}
                styles={{marginBottom: -8}}
              />
            </View>
            <RNPickerSelect
              value={field.value}
              onValueChange={field.onChange}
              placeholder={{label: t('placeholders.select')}}
              items={[
                {
                  label: t('tenantInfomation.oldVNIdCard'),
                  value: UserConst.TypeOfIdCard.OLD_ID_CARD,
                },
                {
                  label: t('tenantInfomation.newVNIdCard'),
                  value: UserConst.TypeOfIdCard.NEW_ID_CARD,
                },
              ]}
              itemKey={1}
              style={{
                inputAndroid: {
                  ...pickerSelectStyles.inputAndroid,
                  borderColor:
                    errors.tenants &&
                    (errors.tenants[index]?.type as any)?.ref?.name ===
                      `tenants.${index}.type`
                      ? appColors.danger
                      : appColors.gray2,
                },
                inputIOS: {
                  ...pickerSelectStyles.inputIOS,
                  borderColor:
                    errors.tenants &&
                    (errors.tenants[index]?.type as any)?.ref?.name ===
                      `tenants.${index}.type`
                      ? appColors.danger
                      : appColors.gray2,
                },
              }}
              useNativeAndroidPickerStyle={false}
            />
            {errors.tenants &&
              (errors.tenants[index]?.type as any)?.ref?.name ===
                `tenants.${index}.type` && (
                <Text style={{color: appColors.danger}}>
                  {t('validation.typeOfIdCardRequired')}
                </Text>
              )}
          </View>
        )}
      />
      {/* name */}
      <Controller
        name={`tenants.${index}.name`}
        control={control}
        rules={{
          required: true,
        }}
        render={({field}) => (
          <View>
            <InputComponent
              label={t('tenantInfomation.name')}
              value={field.value}
              onChange={field.onChange}
              require
              errorMessage={
                errors.tenants &&
                (errors.tenants[index]?.name as any)?.ref?.name ===
                  `tenants.${index}.name`
                  ? t('validation.tenantNameRequired')
                  : undefined
              }
            />
          </View>
        )}
      />
      {/* email */}
      <Controller
        name={`tenants.${index}.email`}
        control={control}
        render={({field}) => (
          <View>
            <InputComponent
              label={'Email'}
              value={field.value}
              onChange={field.onChange}
            />
          </View>
        )}
      />
      {/* phone number */}
      <Controller
        name={`tenants.${index}.phoneNumber`}
        control={control}
        render={({field}) => (
          <View>
            <InputComponent
              label={t('tenantInfomation.phoneNumber')}
              value={field.value}
              onChange={field.onChange}
              numeric
            />
          </View>
        )}
      />
      {/* id number */}
      <Controller
        name={`tenants.${index}.identityCardNumber`}
        control={control}
        rules={{
          required: true,
        }}
        render={({field}) => (
          <View>
            <InputComponent
              label={t('tenantInfomation.idNumber')}
              value={field.value}
              onChange={field.onChange}
              require
              errorMessage={
                errors.tenants &&
                errors.tenants[index]?.identityCardNumber &&
                (errors.tenants[index]?.identityCardNumber as any)?.ref
                  ?.name === `tenants.${index}.identityCardNumber`
                  ? t('validation.tenantIDNumberRequired')
                  : undefined
              }
            />
          </View>
        )}
      />
      {/* gender */}
      <Controller
        name={`tenants.${index}.gender`}
        control={control}
        rules={{
          required: true,
        }}
        render={({field}) => (
          <View style={{marginBottom: 16}}>
            <View style={{flexDirection: 'row'}}>
              <Icon
                name="asterisk"
                size={8}
                color={appColors.danger}
                style={{paddingTop: 3, marginRight: 4}}
              />
              <TextComponent
                text={t('tenantInfomation.gender') + ':'}
                styles={{marginBottom: -8}}
              />
            </View>
            <RNPickerSelect
              value={field.value}
              onValueChange={field.onChange}
              placeholder={{label: t('placeholders.select')}}
              items={[
                {
                  label: t('accountDetail.gender.male'),
                  value: UserConst.Gender.MALE,
                },
                {
                  label: t('accountDetail.gender.female'),
                  value: UserConst.Gender.FEMALE,
                },
              ]}
              itemKey={1}
              style={{
                inputAndroid: {
                  ...pickerSelectStyles.inputAndroid,
                  borderColor:
                    errors.tenants &&
                    (errors.tenants[index]?.gender as any)?.ref?.name ===
                      `tenants.${index}.gender`
                      ? appColors.danger
                      : appColors.gray2,
                },
                inputIOS: {
                  ...pickerSelectStyles.inputIOS,
                  borderColor:
                    errors.tenants &&
                    (errors.tenants[index]?.gender as any)?.ref?.name ===
                      `tenants.${index}.gender`
                      ? appColors.danger
                      : appColors.gray2,
                },
              }}
              useNativeAndroidPickerStyle={false}
            />
            {errors.tenants &&
              (errors.tenants[index]?.gender as any)?.ref?.name ===
                `tenants.${index}.gender` && (
                <Text style={{color: appColors.danger}}>
                  {t('validation.tenantGenderRequired')}
                </Text>
              )}
          </View>
        )}
      />
      {/* place of origin */}
      <Controller
        name={`tenants.${index}.placeOfOrigin`}
        control={control}
        rules={{
          required: true,
        }}
        render={({field}) => (
          <View>
            <InputComponent
              label={t('tenantInfomation.placeOfOrigin')}
              value={field.value}
              onChange={field.onChange}
              require
              errorMessage={
                errors.tenants &&
                errors.tenants[index]?.placeOfOrigin &&
                (errors.tenants[index]?.placeOfOrigin as any)?.ref?.name ===
                  `tenants.${index}.placeOfOrigin`
                  ? t('validation.tenantPlaceOfOriginRequired')
                  : undefined
              }
            />
          </View>
        )}
      />
      {/* place of residence */}
      <Controller
        name={`tenants.${index}.placeOfResidence`}
        control={control}
        rules={{
          required: true,
        }}
        render={({field}) => (
          <View>
            <InputComponent
              label={t('tenantInfomation.placeOfResidence')}
              value={field.value}
              onChange={field.onChange}
              require
              errorMessage={
                errors.tenants &&
                errors.tenants[index]?.placeOfResidence &&
                (errors.tenants[index]?.placeOfResidence as any)?.ref?.name ===
                  `tenants.${index}.placeOfResidence`
                  ? t('validation.tenantPlaceOfResidenceRequired')
                  : undefined
              }
            />
          </View>
        )}
      />
      {/* birthday */}
      <Controller
        name={`tenants.${index}.birthday`}
        control={control}
        rules={{
          required: true,
        }}
        render={({field}) => (
          <View>
            <DateTimePicker
              label={t('tenantInfomation.dateOfBirth') + ':'}
              type="date"
              onSelect={val => field.onChange(new Date(val))}
              selected={field.value}
              require
              maxDate={new Date()}
            />
            {errors.tenants &&
              errors.tenants[index]?.birthday &&
              (errors.tenants[index]?.birthday as any)?.ref?.name ===
                `tenants.${index}.birthday` && (
                <Text style={{color: appColors.danger}}>
                  {t('validation.tenantBirthdayRequired')}
                </Text>
              )}
          </View>
        )}
      />
      {/* country */}
      <Controller
        name={`tenants.${index}.country`}
        control={control}
        rules={{
          required: true,
        }}
        render={({field}) => (
          <View>
            <InputComponent
              label={t('tenantInfomation.country')}
              value={field.value}
              onChange={field.onChange}
              require
              errorMessage={
                errors.tenants &&
                errors.tenants[index]?.country &&
                (errors.tenants[index]?.country as any)?.ref?.name ===
                  `tenants.${index}.country`
                  ? t('validation.tenantCountryRequired')
                  : undefined
              }
            />
          </View>
        )}
      />
      {/* expired time */}
      <Controller
        name={`tenants.${index}.expiredTime`}
        control={control}
        rules={{
          required: true,
        }}
        render={({field}) => (
          <View>
            <InputComponent
              label={t('tenantInfomation.expiredTime')}
              value={field.value}
              onChange={field.onChange}
              require
              errorMessage={
                errors.tenants &&
                errors.tenants[index]?.expiredTime &&
                (errors.tenants[index]?.expiredTime as any)?.ref?.name ===
                  `tenants.${index}.expiredTime`
                  ? t('validation.tenantIDExpiredTimeRequired')
                  : undefined
              }
            />
          </View>
        )}
      />
      <ExtractImageLoadingMask loading={loading} />
    </>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    marginTop: 16,
    borderRadius: 12,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    marginTop: 16,
    borderRadius: 12,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default TenantInputCard;
