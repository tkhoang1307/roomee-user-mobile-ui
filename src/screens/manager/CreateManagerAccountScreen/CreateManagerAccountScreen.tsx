import React, {useEffect, useState} from 'react';
import {View, Alert} from 'react-native';
import {useTranslation} from 'react-i18next';
import {DropdownSelect} from 'react-native-input-select';
import {ScrollView} from 'react-native-gesture-handler';
import {Controller, useForm} from 'react-hook-form';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Button} from '@ant-design/react-native';

import {TitleComponent, InputComponent, TextComponent} from '@components/index';
import {styles} from './styles';
import {CreateManagerAccountScreenProps} from '@models/navigators/ManagerNavigator';
import {accommodationService, ownerService} from '@services';
import {appColors} from '@const/appColors';
import {fontFamilies} from '@const/fontFamilies';

interface FormCreateManagerModel {
  email: string;
  fullname: string;
  password: string;
  confirmPassword: string;
  accommodationId: string[];
}

const CreateManagerAccountScreen: React.FC<CreateManagerAccountScreenProps> = ({
  navigation,
}) => {
  const {t} = useTranslation();
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [dataAllAccommodation, setDataAllAccommodation] = useState<
    Array<{
      value: string;
      label: string;
    }>
  >([]);
  const {
    handleSubmit,
    control,
    formState: {errors},
    getValues,
    reset,
  } = useForm({
    defaultValues: {
      email: '',
      fullname: '',
      password: '',
      confirmPassword: '',
      accommodationId: [],
    },
  });

  const onSubmit = async (data: FormCreateManagerModel) => {
    setCreateLoading(true);
    const {email, fullname, password} = data;
    const payload = {
      username: email,
      name: fullname,
      password: password,
      role: 'MANAGER',
    };
    const accommodations: string[] = data.accommodationId;
    try {
      const dataUser = await ownerService.signupManagerAccount(payload);
      const {id} = dataUser;
      const promises = accommodations.map(async accomId => {
        return accommodationService
          .createManagerForAccommodation(accomId, id)
          .then(_res => {});
      });
      //Promise all
      await Promise.all(promises);
      reset();
      navigation.goBack();
    } catch (error: any) {
    } finally {
      setCreateLoading(false);
    }
  };
  useEffect(() => {
    const getAllAccommodation = async () => {
      try {
        const data = await accommodationService.getAllAccommodations();
        const dataSelectArray = data.map(item => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        setDataAllAccommodation(dataSelectArray);
      } catch (error: any) {
        Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
          {
            text: t('actions.cancel'),
            style: 'cancel',
          },
        ]);
      }
    };
    getAllAccommodation();
  }, []);

  return (
    <View style={[styles.container, {position: 'relative'}]}>
      <TitleComponent
        back
        title={t('actions.createManager')}
        titleStyle={{fontSize: 20, marginTop: -2}}
      />
      <View style={[styles.containerContent, {position: 'relative', flex: 1}]}>
        <ScrollView>
          <Controller
            name={'email'}
            control={control}
            rules={{
              required: true,
            }}
            render={({field}) => (
              <View>
                <InputComponent
                  label={t('placeholders.email')}
                  value={field.value}
                  onChange={field.onChange}
                  require
                  errorMessage={
                    errors.email ? t('validation.emailRequired') : undefined
                  }
                />
              </View>
            )}
          />
          <Controller
            name={'fullname'}
            control={control}
            rules={{
              required: true,
            }}
            render={({field}) => (
              <View>
                <InputComponent
                  label={t('placeholders.fullName')}
                  value={field.value}
                  onChange={field.onChange}
                  require
                  errorMessage={
                    errors.fullname ? t('validation.nameRequired') : undefined
                  }
                />
              </View>
            )}
          />
          <Controller
            name={'password'}
            control={control}
            rules={{
              required: true,
            }}
            render={({field}) => (
              <View>
                <InputComponent
                  label={t('placeholders.password')}
                  value={field.value}
                  onChange={field.onChange}
                  require
                  isPassword
                  errorMessage={
                    errors.password
                      ? t('validation.passwordRequired')
                      : undefined
                  }
                />
              </View>
            )}
          />
          <Controller
            name={'confirmPassword'}
            control={control}
            rules={{
              required: true,
              validate: value => {
                const {password} = getValues();
                if (value !== password) {
                  return t('validation.confirmPasswordError');
                }
              },
            }}
            render={({field}) => (
              <View>
                <InputComponent
                  label={t('placeholders.confirmPassword')}
                  value={field.value}
                  onChange={field.onChange}
                  require
                  isPassword
                  errorMessage={
                    errors.confirmPassword
                      ? errors.confirmPassword.type === 'validate'
                        ? t('validation.confirmPasswordError')
                        : t('validation.confirmPasswordRequired')
                      : undefined
                  }
                />
              </View>
            )}
          />

          <Controller
            name={'accommodationId'}
            control={control}
            rules={{
              required: true,
            }}
            render={({field}) => (
              <View style={{position: 'relative', marginTop: 5}}>
                <Icon
                  name="asterisk"
                  size={8}
                  color={appColors.danger}
                  style={{
                    paddingTop: 3,
                    marginRight: 4,
                    position: 'absolute',
                    top: -6,
                    left: 0,
                  }}
                />
                <DropdownSelect
                  label={t('placeholders.selectAccommodation') + ':'}
                  labelStyle={{
                    marginLeft: 12,
                    fontSize: 14,
                    color: appColors.text,
                    fontFamily: fontFamilies.regular,
                  }}
                  placeholder={t('placeholders.select')}
                  placeholderStyle={{color: appColors.gray}}
                  options={dataAllAccommodation}
                  isMultiple
                  isSearchable
                  selectedValue={field.value}
                  onValueChange={(value: string) => field.onChange([...value])}
                  multipleSelectedItemStyle={{
                    backgroundColor: appColors.gray4,
                    borderRadius: 4,
                  }}
                  dropdownStyle={{
                    paddingLeft: 20,
                    paddingRight: 40,
                    paddingBottom: 0,
                    paddingTop: 0,
                    minHeight: 50,
                    maxHeight: 50,
                    marginTop: -10,
                    borderColor: appColors.gray2,
                    backgroundColor: appColors.white,
                  }}
                  checkboxControls={{
                    checkboxStyle: {borderColor: appColors.gray2},
                    checkboxLabelStyle: {
                      color: appColors.text,
                      fontSize: 16,
                      fontFamily: fontFamilies.medium,
                    },
                  }}
                  searchControls={{
                    textInputStyle: {
                      borderColor: appColors.gray,
                      minHeight: 58,
                      maxHeight: 58,
                      paddingBottom: 10,
                      paddingTop: 10,
                    },
                    textInputProps: {
                      placeholder: t('placeholders.search'),
                    },
                  }}
                  listControls={{
                    selectAllText: t('actions.selectAll'),
                    unselectAllText: t('actions.unSelectAll'),
                  }}
                  dropdownIconStyle={{top: 20, right: 20}}
                  primaryColor={appColors.primary}
                  error={
                    errors.accommodationId
                      ? t('validation.accommodationSelecRequired')
                      : undefined
                  }
                  dropdownErrorTextStyle={{
                    fontSize: 14,
                  }}
                />
              </View>
            )}
          />
        </ScrollView>

        <Button
          type="primary"
          loading={createLoading}
          onPress={handleSubmit(onSubmit)}>
          <TextComponent styles={{color: appColors.white}}>
            {t('actions.submit')}
          </TextComponent>
        </Button>
      </View>
    </View>
  );
};

export default CreateManagerAccountScreen;
