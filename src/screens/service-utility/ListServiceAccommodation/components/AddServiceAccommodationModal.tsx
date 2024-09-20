import {View, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {IconOutline} from '@ant-design/icons-react-native';
import {Modal, Popover} from '@ant-design/react-native';

import InputComponent from '@components/InputComponent';
import {
  ServiceCategoryModel,
  ServiceAccommodationResponseModel,
} from '@models/service-utility';
import UnitComponent from './UnitComponent';
import {serviceUtilityServices} from '@services';
import {TextComponent} from '@components/index';
import {appColors} from '@const/appColors';
import {fontFamilies} from '@const/fontFamilies';
import {ServiceStepStyle} from '../styles';

interface AccommodationInfoStepProps {
  accommoadationId: string;
  accommodationServices: Array<ServiceAccommodationResponseModel>;
  setAccommodationServices: React.Dispatch<
    React.SetStateAction<Array<ServiceAccommodationResponseModel>>
  >;
  isOpenAddModal: boolean;
  setIsOpenAddModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Item = Popover.Item;

const AddServiceAccommodationModal: React.FC<AccommodationInfoStepProps> = ({
  accommoadationId,
  accommodationServices,
  setAccommodationServices,
  isOpenAddModal,
  setIsOpenAddModal,
}) => {
  const {t} = useTranslation();
  const [optionsCategoryService, setOptionsCategoryService] = useState<
    Array<ServiceCategoryModel>
  >([]);
  const [secondaryService, setSecondaryService] =
    useState<ServiceCategoryModel>();
  const [currentSecondarySerivceName, setCurrentSecondarySerivceName] =
    useState<string>('');
  const [currentSecondaryServiceUnit, setcurrentSecondaryServiceUnit] =
    useState<string>('');
  const [secondaryCost, setSecondaryCost] = useState('');

  useEffect(() => {
    const getAllServiceCategory = async () => {
      const resDataServiceCategory =
        await serviceUtilityServices.getAllServicesCategory();
      const cleanResDataServiceCategory = resDataServiceCategory.map(
        (item: ServiceCategoryModel) => ({
          ...item,
          label: t(`service.${item.name}.name`),
          value: item.id,
        }),
      );
      setOptionsCategoryService(cleanResDataServiceCategory);
    };

    getAllServiceCategory();
  }, []);

  const overlaySecondarySerivce = optionsCategoryService.map((item, index) => (
    <Item key={index} value={item.value} style={{padding: 0}}>
      <TextComponent
        text={item.label || ''}
        styles={[ServiceStepStyle.textOverlaySecondServiceStyle]}
      />
    </Item>
  ));

  const getLabelFromValue = (value: string) => {
    const item = optionsCategoryService.find(item => item.value === value);
    return item ? item.label : null;
  };

  const handleCreateServiceAccommodation = async () => {
    if (
      !currentSecondarySerivceName ||
      !currentSecondaryServiceUnit ||
      !secondaryCost
    ) {
      Alert.alert(t(`alertTitle.noti`), t(`alertContent.fillNotEnough`));
      return;
    }

    const payload = {
      name: secondaryService?.name,
      unit: currentSecondaryServiceUnit,
      cost: parseInt(secondaryCost),
      accommodationServiceCategoryId: secondaryService?.id || '',
      accommodationId: accommoadationId,
    };

    const resData =
      await serviceUtilityServices.createSecondaryServiceForAccommodation(
        payload,
      );

    if (resData) {
      setAccommodationServices([...accommodationServices, resData]);
    }

    setCurrentSecondarySerivceName('');
    setSecondaryService({name: '', id: '', unit: []});
    setIsOpenAddModal(false);
  };

  const handleSelectService = (value: string) => {
    setCurrentSecondarySerivceName(value);
    const index = optionsCategoryService.findIndex(s => s.id === value);
    const service = optionsCategoryService[index];
    setSecondaryService(service);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      maskClosable
      visible={isOpenAddModal}
      onClose={() => setIsOpenAddModal(false)}
      footer={[
        {
          text: t('actions.cancel'),
          onPress: () => {},
          style: {color: appColors.danger},
        },
        {
          text: t('actions.addService'),
          onPress: () => handleCreateServiceAccommodation(),
          style: {color: appColors.primary},
        },
      ]}>
      <View style={{width: '110%'}}>
        <View style={{width: '90%'}}>
          <TextComponent
            text={t('actions.addService')}
            styles={{marginBottom: 10}}
          />

          <>
            <Popover
              overlay={overlaySecondarySerivce}
              placement={'bottom'}
              onSelect={handleSelectService}>
              <View
                style={[
                  ServiceStepStyle.unitContainer,
                  {
                    borderColor: appColors.gray2,
                  },
                ]}>
                <View>
                  {currentSecondarySerivceName === '' ? (
                    <TextComponent text={t('placeholders.serviceType')} />
                  ) : (
                    <TextComponent
                      text={
                        getLabelFromValue(currentSecondarySerivceName) || ''
                      }
                      styles={{fontFamily: fontFamilies.bold}}
                    />
                  )}
                </View>
                <IconOutline name="down" />
              </View>
            </Popover>

            <View style={ServiceStepStyle.serviceViewStyle}>
              <View style={{flex: 7.5}}>
                <InputComponent
                  value={secondaryCost}
                  placeholder="100,000"
                  onChange={val => {
                    setSecondaryCost(val);
                  }}
                  type="numeric"
                />
              </View>

              <View style={{flex: 0.5}} />
              <View style={{flex: 7.5}}>
                <UnitComponent
                  initalValue={t('placeholders.countBy')}
                  value={currentSecondaryServiceUnit}
                  setValue={setcurrentSecondaryServiceUnit}
                  type="select"
                  data={
                    secondaryService
                      ? secondaryService.unit.map(s => {
                          return {
                            value: s,
                            label: `₫ / ${t(
                              `service.${secondaryService.name}.unit.${s}`,
                            )}`,
                          };
                        })
                      : []
                  }
                />
              </View>
            </View>
          </>
        </View>
      </View>
    </Modal>
  );
};

export default AddServiceAccommodationModal;
