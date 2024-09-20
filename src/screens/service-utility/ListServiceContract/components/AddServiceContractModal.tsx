import {View, Alert, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {IconOutline} from '@ant-design/icons-react-native';
import {Modal, Popover} from '@ant-design/react-native';

import InputComponent from '@components/InputComponent';
import {
  ServiceAccommodationResponseModel,
  ServiceRoomResponseModel,
} from '@models/service-utility';
import {serviceUtilityServices} from '@services';
import {TextComponent} from '@components/index';
import {appColors} from '@const/appColors';
import {fontFamilies} from '@const/fontFamilies';
import {ServiceStepStyle} from '../styles';
import {MONEY_FORMAT_BY} from '@const/index';
import {ErrorResponseAxios} from '@models/error';

interface AddServiceContractProps {
  roomId: string;
  accommodationId: string;
  roomServiceContracts: Array<ServiceRoomResponseModel>;
  setRoomServiceContracts: React.Dispatch<
    React.SetStateAction<Array<ServiceRoomResponseModel>>
  >;
  isOpenAddModal: boolean;
  setIsOpenAddModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Item = Popover.Item;

const AddServiceContractModal: React.FC<AddServiceContractProps> = ({
  roomId,
  accommodationId,
  roomServiceContracts,
  setRoomServiceContracts,
  isOpenAddModal,
  setIsOpenAddModal,
}) => {
  const {t} = useTranslation();
  const [selectedSecondaryService, setSelectedSecondaryService] =
    useState<ServiceAccommodationResponseModel>();
  const [currentSecondarySerivceName, setCurrentSecondarySerivceName] =
    useState<string>('');
  const [_secondaryCost, setSecondaryCost] = useState('');
  const [accomServices, setAccomServices] = useState<
    ServiceAccommodationResponseModel[]
  >([]);

  useEffect(() => {
    const getAllServicesOfAccommodation = async () => {
      try {
        const servicesRes =
          await serviceUtilityServices.getAllServicesForAccommodation(
            accommodationId,
            'SECONDARY',
          );
        const cleanResDataService = servicesRes.map(
          (item: ServiceAccommodationResponseModel) => ({
            ...item,
            label: t(`service.${item.name}.name`),
            value: item.id,
          }),
        );
        setAccomServices(cleanResDataService);
      } catch (error: any) {
        Alert.alert(
          t(`alertTitle.noti`),
          (error as ErrorResponseAxios).response.data.message,
        );
      }
    };
    getAllServicesOfAccommodation();
  }, []);

  const overlaySecondarySerivce = accomServices.map((item, index) => (
    <Item key={index} value={item.value} style={{padding: 0}}>
      <TextComponent
        text={item.label || ''}
        styles={[ServiceStepStyle.textOverlaySecondServiceStyle]}
      />
    </Item>
  ));

  const getLabelFromValue = (value: string) => {
    const item = accomServices.find(item => item.value === value);
    return item ? item.label : null;
  };

  const handleAddServiceContract = async () => {
    if (!currentSecondarySerivceName) {
      Alert.alert(t(`alertTitle.noti`), t(`alertContent.fillNotEnough`));
      return;
    }

    const payload = {
      accommodationServiceId: currentSecondarySerivceName,
      roomId: roomId,
    };

    const resData = await serviceUtilityServices.createSecondaryServiceForRoom(
      payload,
    );
    if (resData) {
      setRoomServiceContracts([...roomServiceContracts, resData]);
    }
    setIsOpenAddModal(false);
  };

  const handleSelectService = (value: string) => {
    setCurrentSecondarySerivceName(value);
    const index = accomServices.findIndex(s => s.id === value);
    const service = accomServices[index];
    setSelectedSecondaryService(service);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpenAddModal}
      maskClosable
      onClose={() => setIsOpenAddModal(false)}
      footer={[
        {
          text: t('actions.cancel'),
          onPress: () => {},
          style: {color: appColors.danger},
        },
        {
          text: t('actions.addMore'),
          onPress: () => handleAddServiceContract(),
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

            <View style={{width: '100%'}}>
              <InputComponent
                value={
                  selectedSecondaryService?.cost
                    ? `${selectedSecondaryService?.cost}`.replace(
                        MONEY_FORMAT_BY,
                        ',',
                      )
                    : t('placeholders.cost')
                }
                placeholder="100,000"
                onChange={val => {
                  setSecondaryCost(val);
                }}
                type="numeric"
                editable={false}
                styleInput={{height: 56, borderRadius: 12}}
                suffix={
                  <Text>
                    {selectedSecondaryService
                      ? `₫ / ${t(
                          `service.${selectedSecondaryService.name}.unit.${selectedSecondaryService.unit}`,
                        )}`
                      : '₫'}
                  </Text>
                }
              />
            </View>
          </>
        </View>
      </View>
    </Modal>
  );
};

export default AddServiceContractModal;
