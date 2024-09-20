import {Alert, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome';
import RNPickerSelect from 'react-native-picker-select';
import {Controller, useForm} from 'react-hook-form';
import {ImageOrVideo} from 'react-native-image-crop-picker';

import {globalStyles} from '@styles';
import TitleComponent from '@components/TitleComponent';
import {CreateIdentityCardScreenProps} from '@models/navigators/ProfileNavigator';
import SectionComponent from '@components/SectionComponent';
import {appColors} from '@const/appColors';
import ContainerComponent from '@components/ContainerComponent';
import {
  ButtonImagePicker,
  DateTimePicker,
  InputComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '@components/index';
import IdentityCardImage from '@components/IdentityCardImage';
import {UserConst} from '@const/index';
import ExtractImageLoadingMask from '@components/ExtractImageLoadingMask';
import {DefaultIdCardInput} from '@const/user';
import {pickerSelectStyles} from '../styles';
import {Button} from '@ant-design/react-native';
import {userService} from '@services';
import {convertDDMMYYYtoDate} from '@utils/date';
import {normalizeStr} from '@utils/stringHelpers';
import {CreateIdentityCardModel} from '@models/tenant';

const CreateIdentityCardScreen: React.FC<CreateIdentityCardScreenProps> = ({
  navigation,
}) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);
  const [firstLoadImg, setFirstLoadImg] = useState(true);
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [extractImgsFlag, setExtractImgsFlag] = useState(false);
  const [frontImage, setFrontImage] = useState<ImageOrVideo>();
  const [behindImage, setBehindImage] = useState<ImageOrVideo>();
  const [frontImgUrl, setFrontImgUrl] = useState<string>('');
  const [behindImgUrl, setBehindImgUrl] = useState<string>('');
  const [frontImageUrlToSend, setFrontImageUrlToSend] = useState<string>('');
  const [behindImgUrlToSend, setBehindImgUrlToSend] = useState<string>('');
  const {
    handleSubmit,
    control,
    formState: {errors},
    setValue,
    getValues,
  } = useForm({
    defaultValues: {...DefaultIdCardInput}, // Initial value for identity
  });

  const onSubmit = async (values: CreateIdentityCardModel) => {
    try {
      setCreateLoading(true);

      const payload: CreateIdentityCardModel = {
        identityCardNumber: values.identityCardNumber,
        type: values.type,
        name: values.name,
        gender: values.gender,
        placeOfOrigin: values.placeOfOrigin,
        placeOfResidence: values.placeOfResidence,
        birthday: values.birthday,
        country: values.country,
        expiredTime: values.expiredTime,
        imageUrlFront: frontImageUrlToSend,
        imageUrlBehind: behindImgUrlToSend,
      };

      await userService.createOwnerIdCard(payload);

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
    }
  };

  useEffect(() => {
    if (!getValues('imageUrlFront')) setExtractImgsFlag(true);
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
        const data: any = await userService.getDataFromIdCard(bodyFormData);
        setFrontImageUrlToSend(data.imageUrlFront);
        setBehindImgUrlToSend(data.imageUrlBehind);

        Object.keys(data).forEach(key => {
          if (key === 'birthday')
            setValue('birthday', convertDDMMYYYtoDate(data[key]));
          else if (key === 'type') setValue('type', data[key]);
          else if (key.includes('image')) setValue(`${key}` as any, data[key]);
          else setValue(`${key}` as any, normalizeStr(data[key]));
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
    <View style={[globalStyles.container, {position: 'relative'}]}>
      <TitleComponent
        back
        title={t('screensTitle.createIdCard')}
        titleStyle={{fontSize: 20, marginTop: -2}}
      />
      <SpaceComponent height={10} />
      <View style={{flex: 1}}>
        <ContainerComponent isScroll backgroundColor={appColors.white}>
          <SectionComponent>
            {/* image */}
            <View style={{marginBottom: -8}}>
              <View style={{flexDirection: 'row'}}>
                <Icon
                  name="asterisk"
                  size={8}
                  color={appColors.danger}
                  style={{paddingTop: 3, marginRight: 4}}
                />
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
              name={'type'}
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
                        borderColor: errors.type
                          ? appColors.danger
                          : appColors.gray2,
                      },
                      inputIOS: {
                        ...pickerSelectStyles.inputIOS,
                        borderColor: errors.type
                          ? appColors.danger
                          : appColors.gray2,
                      },
                    }}
                    useNativeAndroidPickerStyle={false}
                  />
                  {errors.type && (
                    <Text style={{color: appColors.danger}}>
                      {t('validation.typeOfIdCardRequired')}
                    </Text>
                  )}
                </View>
              )}
            />
            {/* name */}
            <Controller
              name={'name'}
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
                      errors.name
                        ? t('validation.tenantNameRequired')
                        : undefined
                    }
                  />
                </View>
              )}
            />
            {/* id number */}
            <Controller
              name={'identityCardNumber'}
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
                      errors.identityCardNumber
                        ? t('validation.tenantIDNumberRequired')
                        : undefined
                    }
                  />
                </View>
              )}
            />
            {/* gender */}
            <Controller
              name={'gender'}
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
                        borderColor: errors.gender
                          ? appColors.danger
                          : appColors.gray2,
                      },
                      inputIOS: {
                        ...pickerSelectStyles.inputIOS,
                        borderColor: errors.gender
                          ? appColors.danger
                          : appColors.gray2,
                      },
                    }}
                    useNativeAndroidPickerStyle={false}
                  />
                  {errors.gender && (
                    <Text style={{color: appColors.danger}}>
                      {t('validation.tenantGenderRequired')}
                    </Text>
                  )}
                </View>
              )}
            />
            {/* place of origin */}
            <Controller
              name={'placeOfOrigin'}
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
                      errors.placeOfOrigin
                        ? t('validation.tenantPlaceOfOriginRequired')
                        : undefined
                    }
                  />
                </View>
              )}
            />
            {/* place of residence */}
            <Controller
              name={'placeOfResidence'}
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
                      errors.placeOfResidence
                        ? t('validation.tenantPlaceOfResidenceRequired')
                        : undefined
                    }
                  />
                </View>
              )}
            />
            {/* birthday */}
            <Controller
              name={'birthday'}
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
                  {errors.birthday && (
                    <Text style={{color: appColors.danger}}>
                      {t('validation.tenantBirthdayRequired')}
                    </Text>
                  )}
                </View>
              )}
            />
            {/* country */}
            <Controller
              name={'country'}
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
                      errors.country
                        ? t('validation.tenantCountryRequired')
                        : undefined
                    }
                  />
                </View>
              )}
            />
            {/* expired time */}
            <Controller
              name={'expiredTime'}
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
                      errors.expiredTime
                        ? t('validation.tenantIDExpiredTimeRequired')
                        : undefined
                    }
                  />
                </View>
              )}
            />
            <ExtractImageLoadingMask
              loading={loading}
              styles={{marginTop: 290}}
            />
          </SectionComponent>
        </ContainerComponent>
        <SectionComponent
          styles={{
            backgroundColor: appColors.white,
            paddingBottom: 0,
            paddingHorizontal: 0,
          }}>
          <Button
            style={{borderBottomEndRadius: 0, borderBottomStartRadius: 0}}
            type="primary"
            loading={createLoading}
            onPress={handleSubmit(onSubmit)}>
            <TextComponent styles={{color: appColors.white}}>
              {t('actions.submit')}
            </TextComponent>
          </Button>
        </SectionComponent>
      </View>
    </View>
  );
};

export default CreateIdentityCardScreen;
