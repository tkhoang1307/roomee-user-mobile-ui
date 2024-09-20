import {
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Modal} from '@ant-design/react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {globalStyles} from '@styles';
import InputComponent from '@components/InputComponent';
import {ServiceCategoryModel, ServiceModel} from '@models/accommodation';
import {findServiceCategory} from '@utils/accommodation';
import ButtonComponent from '@components/ButtonComponent';
import {
  CircleComponent,
  SpaceComponent,
  TextComponent,
} from '@components/index';
import {appColors} from '@const/appColors';
import {fontFamilies} from '@const/fontFamilies';
import {ServiceStepStyle} from '../styles';
import ServiceUnit from './ServiceUnit';
import {ErrorsAccommodationServices} from '../AddAccommodationScreen';

interface AccommodationInfoStepProps {
  // onFinish: (value: any) => void;
  secondaryServices: ServiceModel[];
  setSecondarySerives: React.Dispatch<React.SetStateAction<ServiceModel[]>>;
  serviceCategories: ServiceCategoryModel[];
  rentalCost: string;
  waterCost: string;
  electricCost: string;
  waterUnit: string;
  // electricUnit:string;
  setRentalCost: React.Dispatch<React.SetStateAction<string>>;
  setWaterCost: React.Dispatch<React.SetStateAction<string>>;
  setElectricCost: React.Dispatch<React.SetStateAction<string>>;
  setWaterUnit: React.Dispatch<React.SetStateAction<string>>;
  errorMessagesServices: ErrorsAccommodationServices;
  setErrorMessages: React.Dispatch<
    React.SetStateAction<ErrorsAccommodationServices>
  >;
  setErrorSecondService: React.Dispatch<React.SetStateAction<string>>;
  errorSecondService: string;
}

const AccommodationServicesStep: React.FC<AccommodationInfoStepProps> = ({
  // onFinish,
  secondaryServices,
  setSecondarySerives,
  serviceCategories,
  rentalCost,
  waterCost,
  electricCost,
  setRentalCost,
  setWaterCost,
  setElectricCost,
  waterUnit,
  setWaterUnit,
  errorMessagesServices,
  setErrorMessages,
  errorSecondService,
  setErrorSecondService,
}) => {
  const {t} = useTranslation();
  const [openModalAddSecondSerivce, setOpenModalAddSecondSerivce] =
    useState<boolean>(false);

  const waterService = findServiceCategory('water', serviceCategories);
  const electricService = findServiceCategory('electric', serviceCategories);

  //state for name service
  const [currentSecondaryServiceName, setCurrentSecondaryServiceName] =
    useState<string>('');

  //state for unit secondary service
  const [currentSecondaryServiceUnit, setCurrentSecondaryServiceUnit] =
    useState<string>('');
  //state for currentSercondaryService unit have to key is value and label
  const [secondaryService, setSecondaryService] =
    useState<ServiceCategoryModel>();
  //state for cost of secondary service
  const [secondaryCost, setSecondaryCost] = useState('');
  const [errorAddSecondService, setErrorAddSecondService] = useState('');

  const serviceTypeOpts = serviceCategories.map(s => {
    return {
      value: s.id,
      label: t(`service.${s.name}.name`),
    };
  });
  const secondaryServiceTypeOpts = serviceTypeOpts.filter(
    s => s.value !== waterService?.id && s.value !== electricService?.id,
  );

  const listSecondServices = useMemo(() => {
    return secondaryServiceTypeOpts.map((item, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => {
          setCurrentSecondaryServiceName(item.value);
          setCurrentSecondaryServiceUnit('');
          const index = serviceCategories.findIndex(s => s.id === item.value);
          const sv = serviceCategories[index];
          setSecondaryService(sv);
        }}
        style={{
          height: 50,
          borderRadius: 10,
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: appColors.gray2,
          backgroundColor:
            currentSecondaryServiceName === item.value
              ? appColors.backgroundLight
              : appColors.white,
          marginBottom: 20,
        }}>
        <TextComponent styles={{marginLeft: 15}}>{item.label}</TextComponent>
      </TouchableOpacity>
    ));
  }, [secondaryServiceTypeOpts]);

  const listSecondUnitServices = useMemo(() => {
    const data = secondaryService?.unit.map(s => {
      return {
        value: s,
        label: `₫ / ${t(`service.${secondaryService.name}.unit.${s}`)}`,
      };
    });
    return data?.map((item, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => {
          setCurrentSecondaryServiceUnit(item.value);
        }}
        style={{
          height: 50,
          borderRadius: 10,
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: appColors.gray2,
          backgroundColor:
            currentSecondaryServiceUnit === item.value
              ? appColors.backgroundLight
              : appColors.white,
          marginBottom: 20,
        }}>
        <TextComponent styles={{marginLeft: 15}}>{item.label}</TextComponent>
      </TouchableOpacity>
    ));
  }, [secondaryService, currentSecondaryServiceUnit]);

  const handleAddSecondService = () => {
    if (
      currentSecondaryServiceName === '' ||
      currentSecondaryServiceUnit === '' ||
      secondaryCost === ''
    ) {
      setErrorAddSecondService(t('validation.allRequired'));
      return;
    }
    const service = {
      name: currentSecondaryServiceName,
      unit: currentSecondaryServiceUnit,
      cost: secondaryCost,
      accommodationServiceCategoryId: secondaryService?.id || '',
    };
    const index = secondaryServices.findIndex(
      s => s.accommodationServiceCategoryId === service.name,
    ); //compare id
    if (index !== -1) {
      Alert.alert(t('alertTitle.noti'), t('error.duplicatedService'), [
        {
          text: 'Xác nhận',
          style: 'cancel',
        },
      ]);
      return;
    }

    const idx = serviceCategories.findIndex(s => s.id === service.name); //compare id
    const newServices: ServiceModel[] = [
      ...secondaryServices,
      {
        accommodationServiceCategoryId: serviceCategories[idx].id,
        cost: service.cost,
        unit: service.unit,
        name: serviceCategories[idx].name,
      },
    ];
    setSecondaryCost('');
    setOpenModalAddSecondSerivce(false);
    setSecondarySerives(newServices);
    setCurrentSecondaryServiceName('');
    setSecondaryService({name: '', id: '', unit: []});
  };

  return (
    <View style={globalStyles.container}>
      <ScrollView>
        {/* Rental cost */}
        <ServiceUnit
          type="input"
          label={t('label.rentalCost')}
          value={rentalCost}
          setValue={setRentalCost}
          unit={[
            {
              value: t('unit.month'),
              label: `₫/${t('unit.month')}`,
            },
          ]}
          placeholder={t('placeholders.rentalCost')}
          defaultUnit={t('unit.month')}
          errorMessage={errorMessagesServices.rentalCost}
          setErrorMessages={setErrorMessages}
          name="rentalCost"
        />

        {/* Water service */}
        <ServiceUnit
          type="modal"
          label={t('service.water.name')}
          value={waterCost}
          setValue={setWaterCost}
          unit={
            waterService
              ? waterService.unit.map(s => {
                  return {
                    value: s,
                    label: `₫ / ${t(`service.${waterService.name}.unit.${s}`)}`,
                  };
                })
              : []
          }
          placeholder={t('placeholders.waterCost')}
          setValueUnit={setWaterUnit}
          defaultUnit={waterUnit}
          errorMessage={errorMessagesServices.waterCost}
          setErrorMessages={setErrorMessages}
          name="waterCost"
        />

        {/* Electric service */}
        <ServiceUnit
          type="modal"
          label={t('service.electric.name')}
          value={electricCost}
          setValue={setElectricCost}
          unit={
            electricService
              ? electricService.unit.map(s => {
                  return {
                    value: s,
                    label: `₫ / ${t(
                      `service.${electricService.name}.unit.${s}`,
                    )}`,
                  };
                })
              : []
          }
          placeholder={t('placeholders.electricityCost')}
          defaultUnit={electricService ? electricService.unit[0] : undefined}
          errorMessage={errorMessagesServices.electricCost}
          setErrorMessages={setErrorMessages}
          name="electricCost"
        />

        {/* Title for secondary service */}
        <TextComponent
          text={t('step.createAccommodation.secondaryServices')}
          styles={{marginBottom: 10}}
        />

        {secondaryServices.map(s => (
          <View
            style={{flexDirection: 'column'}}
            key={s.accommodationServiceCategoryId}>
            <View style={ServiceStepStyle.serviceViewStyle}>
              <View style={{width: 300}}>
                <View style={{flexDirection: 'row'}}>
                  <Icon
                    name="asterisk"
                    size={8}
                    color={appColors.danger}
                    style={{paddingTop: 3, marginRight: 4}}
                  />
                  <TextComponent
                    text={t(`service.${s.name}.name`)}
                    styles={{marginBottom: -8}}
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderRadius: 10,
                  }}>
                  <InputComponent
                    placeholder={t('placeholders.electricityCost')}
                    value={s.cost.toString()}
                    onChange={value => {
                      const newServices = secondaryServices.map(sv => {
                        if (sv.name === s.name) sv.cost = value!;
                        return sv;
                      });
                      setErrorSecondService('');
                      setSecondarySerives(newServices);
                    }}
                    type="numeric"
                    suffix={
                      <View
                        style={{
                          backgroundColor: appColors.gray2,
                          height: 30,
                          width: 80,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 4,
                        }}>
                        <TextComponent
                          styles={{fontFamily: fontFamilies.semiBold}}>
                          {`₫ / ${t(`service.${s.name}.unit.${s.unit}`)}`}
                        </TextComponent>
                      </View>
                    }
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  paddingBottom: 5,
                }}>
                <CircleComponent
                  styles={{backgroundColor: appColors.danger}}
                  onPress={() => {
                    setSecondarySerives(
                      secondaryServices.filter(
                        sS =>
                          sS.accommodationServiceCategoryId !==
                          s.accommodationServiceCategoryId,
                      ),
                    );
                    setSecondaryCost('');
                  }}>
                  <Icon name="trash" size={18} color={appColors.white} />
                </CircleComponent>
              </View>
            </View>
          </View>
        ))}
        <View>
          {errorSecondService ? (
            <TextComponent styles={{color: appColors.danger}}>
              {errorSecondService}
            </TextComponent>
          ) : (
            <TextComponent></TextComponent>
          )}
        </View>

        <Modal
          visible={openModalAddSecondSerivce}
          animationType={'slide'}
          transparent={true}
          maskClosable
          style={{width: Dimensions.get('window').width * 0.9}}>
          <View>
            <TextComponent
              text={t('label.secondService') + ':'}
              styles={{fontFamily: fontFamilies.semiBold, marginBottom: 10}}
            />
            {listSecondServices}
            <InputComponent
              value={secondaryCost}
              placeholder="100,000"
              onChange={val => {
                setSecondaryCost(val);
              }}
              type="number-pad"
              label={t('label.serviceCost')}
              styleLabel={{fontFamily: fontFamilies.semiBold}}
            />
            <TextComponent
              text={t('label.unit') + ':'}
              styles={{fontFamily: fontFamilies.semiBold, marginBottom: 10}}
            />

            <View style={{height: 130}}>{listSecondUnitServices}</View>
            <View>
              {errorAddSecondService ? (
                <TextComponent styles={{color: appColors.danger}}>
                  {errorAddSecondService}
                </TextComponent>
              ) : (
                <TextComponent></TextComponent>
              )}
            </View>
            <SpaceComponent height={10} />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <ButtonComponent
                type="primary"
                styles={{
                  backgroundColor: appColors.gray,
                  width: 150,
                }}
                onPress={() => {
                  setOpenModalAddSecondSerivce(false);
                  setErrorAddSecondService('');
                }}>
                {t('actions.cancel')}
              </ButtonComponent>
              <ButtonComponent
                type="primary"
                styles={{width: 150}}
                onPress={() => {
                  handleAddSecondService();
                }}>
                {t('actions.submit')}
              </ButtonComponent>
            </View>
          </View>
        </Modal>

        {/* Component add new service when click create new service */}
        <View
          style={{
            backgroundColor: appColors.white,
            alignSelf: 'flex-end',
            width: '30%',
            borderColor: appColors.primary,
            borderWidth: 1,
            borderRadius: 8,
            height: 50,
            justifyContent: 'center',
            marginTop: 20,
          }}>
          <TouchableOpacity
            onPress={() => {
              setOpenModalAddSecondSerivce(true);
            }}>
            <TextComponent
              styles={{textAlign: 'center', color: appColors.primary}}>
              {t('actions.addMore')}
            </TextComponent>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default AccommodationServicesStep;
