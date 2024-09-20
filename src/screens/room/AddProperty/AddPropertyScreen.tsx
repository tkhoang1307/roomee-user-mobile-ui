import {TextInput, View} from 'react-native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Controller, useForm} from 'react-hook-form';

import {AddPropertyScreenProps} from '@models/navigators/HomNavigator';
import {globalStyles} from '@styles';
import {
  ButtonComponent,
  ContainerComponent,
  InputComponent,
  SectionComponent,
  TextComponent,
  TitleComponent,
} from '@components/index';
import {appColors} from '@const/appColors';
import SelectPropertyStatus from '@components/property/SelectPropertyStatus';
import {PropertyStatus} from '@const/property';
import {RoomPropertyPayloadModel} from '@models/room';
import {roomService} from '@services';

interface FormValuesProperty {
  name: string;
  quantity: string;
  notes: string;
  status: PropertyStatus;
}

const AddPropertyScreen: React.FC<AddPropertyScreenProps> = ({
  navigation,
  route,
}) => {
  const {t} = useTranslation();
  const {roomId} = route.params;
  const [loadingAddProperty, setLoadingAddProperty] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      name: '',
      quantity: '',
      notes: '',
      status: PropertyStatus.GOOD,
    },
  });

  const onSubmit = async (data: FormValuesProperty) => {
    setLoadingAddProperty(true);
    const payload: RoomPropertyPayloadModel = {
      roomId: roomId,
      name: data.name,
      quantity: parseInt(data.quantity),
      notes: data.notes,
      status: data.status,
    };
    try {
      await roomService.createRoomProperty(payload);
      navigation.goBack();
    } catch (error: any) {
    } finally {
      setLoadingAddProperty(false);
    }
  };

  return (
    <View style={[globalStyles.container]}>
      <TitleComponent
        back
        title={t('actions.addProperty')}
        titleStyle={{fontSize: 20, marginTop: -2}}
        backgroundColor={appColors.white}
      />

      <SectionComponent
        styles={{backgroundColor: appColors.white, marginTop: 10, flex: 1}}>
        <ContainerComponent isScroll>
          <View style={{marginTop: 20}}>
            <Controller
              control={control}
              name="name"
              render={({field: {onChange, value}}) => (
                <InputComponent
                  label={t('label.nameProperty')}
                  placeholder={t('placeholders.nameProperty')}
                  allowClear
                  value={value}
                  onChange={val => onChange(val)}
                  errorMessage={
                    errors.name
                      ? t('validation.namePropertyRequired')
                      : undefined
                  }
                />
              )}
              rules={{required: t('validation.namePropertyRequired')}}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                width: '100%',
                paddingRight: 58,
              }}>
              <View style={{width: '49%'}}>
                <Controller
                  control={control}
                  name="quantity"
                  render={({field: {onChange, value}}) => (
                    <InputComponent
                      label={t('label.quantity')}
                      placeholder={t('placeholders.quantity')}
                      allowClear
                      type="numeric"
                      value={value.toString()}
                      onChange={val => onChange(val)}
                      errorMessage={
                        errors.quantity
                          ? t('validation.quantityRequired')
                          : undefined
                      }
                    />
                  )}
                  rules={{required: t('validation.quantityRequired')}}
                />
              </View>

              <View style={{width: '45%'}}>
                <Controller
                  control={control}
                  render={({field: {onChange, value}}) => (
                    <View style={{gap: 8}}>
                      <TextComponent>{t('label.status') + ': '}</TextComponent>
                      <SelectPropertyStatus
                        setValue={onChange}
                        value={value}
                        type="select"
                        style={{height: 50}}
                      />
                    </View>
                  )}
                  name="status"
                  // rules={{required: t('validation.floorRequired')}}
                />
              </View>
            </View>
            <Controller
              control={control}
              name="notes"
              rules={{required: t('validation.notesRequired')}}
              render={({field: {onChange, value}}) => (
                <View style={{gap: 10}}>
                  <TextComponent>{t('label.notes') + ': '}</TextComponent>
                  <TextInput
                    style={{
                      height: 100,
                      borderColor: appColors.gray,
                      borderWidth: 0.3,
                      padding: 10,
                      borderRadius: 5,
                    }}
                    // underlineColorAndroid="transparent"
                    placeholder={t('placeholders.notes')}
                    placeholderTextColor="grey"
                    numberOfLines={10}
                    multiline={true}
                    value={value}
                    onChangeText={val => {
                      onChange(val);
                    }}
                  />
                </View>
              )}
            />
          </View>
        </ContainerComponent>
      </SectionComponent>
      <SectionComponent styles={{backgroundColor: appColors.white}}>
        <ButtonComponent
          loading={loadingAddProperty}
          text={t('actions.submit')}
          onPress={handleSubmit(onSubmit)}
          type="primary"
          styles={{marginBottom: 0}}
        />
      </SectionComponent>
    </View>
  );
};

export default AddPropertyScreen;
