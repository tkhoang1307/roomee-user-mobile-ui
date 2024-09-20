import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Button} from '@ant-design/react-native';
import {Controller, useForm} from 'react-hook-form';
import RNPickerSelect from 'react-native-picker-select';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';

import {
  CreateIdentityCardModel,
  CreateTenantInputControl,
  CreateTenantModel,
} from '@models/tenant';
import {globalStyles} from '@styles';
import {UserConst} from '@const/index';
import {appColors} from '@const/appColors';
import {convertDDMMYYYtoDate} from '@utils/date';
import {DefaultTenantInput} from '@const/tenant';
import {normalizeStr} from '@utils/stringHelpers';
import RowComponent from '@components/RowComponent';
import {roomService, tenantService} from '@services';
import TextComponent from '@components/TextComponent';
import SpaceComponent from '@components/SpaceComponent';
import InputComponent from '@components/InputComponent';
import DateTimePicker from '@components/DatetimePicker';
import TitleComponent from '@components/TitleComponent';
import IdentityCardImage from '@components/IdentityCardImage';
import ButtonImagePicker from '@components/ButtomImagePicker';
import {AddTenantScreenProps} from '@models/navigators/HomNavigator';
import ExtractImageLoadingMask from '@components/ExtractImageLoadingMask';

const AddTenantScreen: React.FC<AddTenantScreenProps> = ({
  navigation,
  route,
}) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);
  const [frontImage, setFrontImage] = useState<ImageOrVideo>();
  const [behindImage, setBehindImage] = useState<ImageOrVideo>();
  const [frontImgUrl, setFrontImgUrl] = useState('');
  const [behindImgUrl, setBehindImgUrl] = useState('');
  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm({
    defaultValues: DefaultTenantInput,
  });

  const onSubmit = async (values: CreateTenantInputControl) => {
    try {
      setLoading(true);

      const identityCards: CreateIdentityCardModel[] = [
        {
          identityCardNumber: values.identityCardNumber,
          type: values.type!,
          name: values.name,
          gender: values.gender!,
          placeOfOrigin: values.placeOfOrigin,
          placeOfResidence: values.placeOfResidence,
          birthday: values.birthday,
          country: values.country,
          expiredTime: values.expiredTime,
          imageUrlFront: frontImgUrl || '',
          imageUrlBehind: behindImgUrl || '',
        },
      ];

      const payload: CreateTenantModel = {
        email: values.email,
        phoneNumber: values.phoneNumber || '',
        contractId: route.params.contractId,
        isRoomLeader: false,
        identityCards: identityCards,
      };
      await tenantService.createTenant(payload, route.params.roomId || '');
    } catch (error: any) {
      Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
        {
          text: t('actions.cancel'),
          style: 'cancel',
        },
      ]);
    } finally {
      setLoading(false);
      navigation.goBack();
    }
  };

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
          route.params.roomId || '',
        );

        Object.keys(data).forEach(key => {
          if (key === 'birthday')
            setValue('birthday', convertDDMMYYYtoDate(data[key]));
          else if (key === 'type') setValue(`type`, data[key]);
          else if (key.includes('image')) setValue(key as any, data[key]);
          else if (key.includes('expiredTime')) {
            if ((data[key] as string).includes('/'))
              setValue(
                key as any,
                (data[key] as string).replace(/[^0-9/]/g, ''),
              );
            else setValue(key as any, normalizeStr(data[key], true));
          } else if (key.includes('Residence') || key.includes('residence')) {
            let re = (data[key] as string)?.replace('Residence', '') || '';
            re = re.replace('residence', '');
            re = re.replace('.', '');
            setValue(key as any, normalizeStr(re));
          } else setValue(key as any, normalizeStr(data[key]));
        });
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
      handleExtractImage();
    }
  }, [frontImage, behindImage]);

  return (
    <View style={{...globalStyles.container, rowGap: 8}}>
      <TitleComponent
        backgroundColor={appColors.backgroundCard}
        back
        title={`${t('actions.addTenant')} - ${t('label.room')} ${
          route.params.roomName
        }`}
        titleStyle={{fontSize: 20}}
      />
      <View
        style={{
          flex: 1,
          marginHorizontal: 8,
        }}>
        <ScrollView>
          <View
            style={{
              paddingVertical: 8,
              paddingHorizontal: 8,
              borderRadius: 8,
              backgroundColor: appColors.backgroundCard,
            }}>
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
              name="type"
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
              name="name"
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
            {/* email */}
            <Controller
              name="email"
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
              name="phoneNumber"
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
              name="identityCardNumber"
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
              name="gender"
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
              name="placeOfOrigin"
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
              name="placeOfResidence"
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
              name="birthday"
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
              name="country"
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
              name="expiredTime"
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
            <ExtractImageLoadingMask loading={loading} />
          </View>
        </ScrollView>
      </View>
      <Button
        type="primary"
        style={globalStyles.closePopupButton}
        loading={loading}
        onPress={handleSubmit(onSubmit)}>
        {t('actions.submit')}
      </Button>
    </View>
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

export default AddTenantScreen;
