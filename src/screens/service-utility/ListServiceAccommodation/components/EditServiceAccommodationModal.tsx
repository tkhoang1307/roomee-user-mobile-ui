import {View, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {IconOutline} from '@ant-design/icons-react-native';
import {Modal, Popover} from '@ant-design/react-native';

import InputComponent from '@components/InputComponent';
import {
  ServiceAccommodationResponseModel,
  UnitModel,
} from '@models/service-utility';
import UnitComponent from './UnitComponent';
import {serviceUtilityServices} from '@services';
import {TextComponent} from '@components/index';
import {appColors} from '@const/appColors';
import {fontFamilies} from '@const/fontFamilies';
import {ServiceStepStyle} from '../styles';

interface AccommodationInfoStepProps {
  selectedService: ServiceAccommodationResponseModel;
  setAccommodationServices: React.Dispatch<
    React.SetStateAction<Array<ServiceAccommodationResponseModel>>
  >;
  isOpenEditModal: boolean;
  setIsOpenEditModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditServiceAccommodationModal: React.FC<AccommodationInfoStepProps> = ({
  selectedService,
  setAccommodationServices,
  isOpenEditModal,
  setIsOpenEditModal,
}) => {
  const {t} = useTranslation();
  const [currentSecondarySerivceName, setCurrentSecondarySerivceName] =
    useState<string>('');
  const [currentSecondaryServiceUnit, setcurrentSecondaryServiceUnit] =
    useState<string>('');
  const [secondaryCost, setSecondaryCost] = useState<string>('');
  const [optionsUnit, setOptionsUnit] = useState<Array<UnitModel>>([]);

  useEffect(() => {
    const getServiceCategoryById = async () => {
      if (selectedService) {
        const resDataServiceCategory =
          await serviceUtilityServices.getServiceCategoryById(
            selectedService.accommodationServiceCategoryId,
          );
        const cleanResDataServiceCategory = resDataServiceCategory.unit.map(
          item => ({
            label: `₫ / ${t(`service.${selectedService.name}.unit.${item}`)}`,
            value: item,
          }),
        );
        setCurrentSecondarySerivceName(resDataServiceCategory.name);
        setcurrentSecondaryServiceUnit(selectedService.unit);
        setSecondaryCost(selectedService.cost.toString());
        setOptionsUnit(cleanResDataServiceCategory);
      }
    };
    getServiceCategoryById();
  }, [isOpenEditModal]);

  const handleEditServiceAccommodation = async () => {
    if (
      !currentSecondarySerivceName ||
      !currentSecondaryServiceUnit ||
      !secondaryCost
    ) {
      Alert.alert(t(`alertTitle.noti`), t(`alertContent.fillNotEnough`));
      return;
    }

    const payload = {
      unit: currentSecondaryServiceUnit,
      cost: parseInt(secondaryCost),
      accommodationServiceId: selectedService.id,
      accommodationId: selectedService.accommodationId,
    };

    const resDataAccommodationService =
      serviceUtilityServices.updateSecondaryServiceForAccommodation(payload);
    if (
      resDataAccommodationService !== undefined ||
      resDataAccommodationService !== null
    ) {
      setAccommodationServices(prevAccommodationService => {
        const updatedAccommodationServiceIndex =
          prevAccommodationService.findIndex(u => u.id === selectedService?.id);
        if (updatedAccommodationServiceIndex !== -1) {
          const updatedRoomServices = [...prevAccommodationService];
          updatedRoomServices[updatedAccommodationServiceIndex] = {
            ...updatedRoomServices[updatedAccommodationServiceIndex],
            unit: currentSecondaryServiceUnit,
            cost: parseInt(secondaryCost),
          };
          return updatedRoomServices;
        }
        return prevAccommodationService;
      });
    }

    setIsOpenEditModal(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpenEditModal}
      maskClosable
      onClose={() => setIsOpenEditModal(false)}
      footer={[
        {
          text: t('actions.cancel'),
          onPress: () => {},
          style: {color: appColors.danger},
        },
        {
          text: t('actions.edit'),
          onPress: () => handleEditServiceAccommodation(),
          style: {color: appColors.primary},
        },
      ]}>
      <View style={{width: '110%'}}>
        <View style={{width: '90%'}}>
          <TextComponent
            text={t('actions.editService')}
            styles={{marginBottom: 10}}
          />

          <>
            <Popover overlay={[]} placement={'bottom'} disabled={true}>
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
                      text={t(`service.${currentSecondarySerivceName}.name`)}
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
                  type="number-pad"
                />
              </View>

              <View style={{flex: 0.5}} />
              <View style={{flex: 7.5}}>
                <UnitComponent
                  initalValue={t('placeholders.countBy')}
                  value={currentSecondaryServiceUnit}
                  setValue={setcurrentSecondaryServiceUnit}
                  type="select"
                  data={optionsUnit}
                />
              </View>
            </View>
          </>
        </View>
      </View>
    </Modal>
  );
};

export default EditServiceAccommodationModal;
