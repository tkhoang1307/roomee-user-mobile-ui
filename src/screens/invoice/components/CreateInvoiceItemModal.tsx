import {View, Alert, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {IconOutline} from '@ant-design/icons-react-native';
import {Modal, Popover} from '@ant-design/react-native';

import InputComponent from '@components/InputComponent';
import {ServiceRoomResponseModel} from '@models/service-utility';
import {serviceUtilityServices} from '@services';
import {TextComponent} from '@components/index';
import {appColors} from '@const/appColors';
import {fontFamilies} from '@const/fontFamilies';
import {ServiceStepStyle} from '../styles';
import {MONEY_FORMAT_BY} from '@const/index';
import {ErrorResponseAxios} from '@models/error';
import {CreationInvoiceItemModel} from '@models/invoices';
import {isNumeric} from '@utils/accommodation';

interface CreateInvoiceItemModalProps {
  roomId: string;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  serviceInvoiceItems: CreationInvoiceItemModel[];
  setServiceInvoiceItems: React.Dispatch<
    React.SetStateAction<CreationInvoiceItemModel[]>
  >;
}

const Item = Popover.Item;

const CreateInvoiceItemModal: React.FC<CreateInvoiceItemModalProps> = ({
  roomId,
  modalOpen,
  setModalOpen,
  serviceInvoiceItems,
  setServiceInvoiceItems,
}) => {
  const {t} = useTranslation();
  const [roomServices, setRoomServices] = useState<ServiceRoomResponseModel[]>(
    [],
  );
  const [selectedSecondaryService, setSelectedSecondaryService] =
    useState<ServiceRoomResponseModel | null>(null);
  const [currentSecondarySerivceName, setCurrentSecondarySerivceName] =
    useState<string>('');
  const [_secondaryCost, setSecondaryCost] = useState('');
  const [quantity, setQuantity] = useState<string>('');
  const [oldIndicator, setOldIndicator] = useState<string>('');
  const [newIndicator, setNewIndicator] = useState<string>('');

  useEffect(() => {
    const getAllServicesOfRoom = async () => {
      try {
        const resDataRoomService =
          await serviceUtilityServices.getAllServicesForRoom(roomId, 'ALL');
        const filterResDataRoomService = resDataRoomService.filter(
          service => !service.deleted,
        );
        const cleanResDataService = filterResDataRoomService.map(
          (item: ServiceRoomResponseModel) => ({
            ...item,
            label: t(`service.${item.name}.name`),
            value: item.id,
          }),
        );
        setRoomServices(cleanResDataService);
        setQuantity('');
        setOldIndicator('');
        setNewIndicator('');
      } catch (error: any) {
        Alert.alert(
          t(`alertTitle.noti`),
          (error as ErrorResponseAxios).response.data.message,
        );
      }
    };

    getAllServicesOfRoom();
  }, [modalOpen, roomId]);

  const overlaySecondarySerivce = roomServices.map((item, index) => (
    <Item key={index} value={item.value} style={{padding: 0}}>
      <TextComponent
        text={item.label || ''}
        styles={[ServiceStepStyle.textOverlaySecondServiceStyle]}
      />
    </Item>
  ));

  const getLabelFromValue = (value: string) => {
    const item = roomServices.find(item => item.value === value);
    return item ? item.label : null;
  };

  const handleAddInvoiceItem = async () => {
    try {
      if (
        selectedSecondaryService?.name == 'electric' ||
        (selectedSecondaryService?.name == 'water' &&
          selectedSecondaryService?.unit == 'm3')
      ) {
        if (
          !currentSecondarySerivceName ||
          !selectedSecondaryService ||
          !oldIndicator ||
          !newIndicator
        ) {
          Alert.alert(t(`alertTitle.noti`), t(`alertContent.fillNotEnough`));
          return;
        }
      } else {
        if (
          !currentSecondarySerivceName ||
          !selectedSecondaryService ||
          !quantity
        ) {
          Alert.alert(t(`alertTitle.noti`), t(`alertContent.fillNotEnough`));
          return;
        }
      }

      const roomServiceIndex = serviceInvoiceItems.findIndex(
        u => u.key === selectedSecondaryService.id,
      );

      if (roomServiceIndex !== -1) {
        setServiceInvoiceItems(prevServiceInvoiceItems => {
          const updatedServiceInvoiceItemsIndex =
            prevServiceInvoiceItems.findIndex(
              u => u.key === selectedSecondaryService.id,
            );
          if (updatedServiceInvoiceItemsIndex !== -1) {
            const updatedRoomServices = [...prevServiceInvoiceItems];
            updatedRoomServices[updatedServiceInvoiceItemsIndex] = {
              ...updatedRoomServices[updatedServiceInvoiceItemsIndex],
              // quantity:
              //     updatedRoomServices[updatedServiceInvoiceItemsIndex].quantity +
              //     parseInt(quantity),
              quantity:
                selectedSecondaryService.name === 'electric' ||
                (selectedSecondaryService.name === 'water' &&
                  selectedSecondaryService.unit === 'm3')
                  ? newIndicator && oldIndicator
                    ? parseInt(newIndicator) - parseInt(oldIndicator)
                    : 0
                  : updatedRoomServices[updatedServiceInvoiceItemsIndex]
                      .quantity + parseInt(quantity),
              meta:
                selectedSecondaryService.name === 'electric' ||
                (selectedSecondaryService.name === 'water' &&
                  selectedSecondaryService.unit === 'm3')
                  ? {
                      oldIndicator: parseInt(oldIndicator) || undefined,
                      newIndicator: parseInt(newIndicator) || undefined,
                    }
                  : undefined,
            };
            return updatedRoomServices;
          }
          return prevServiceInvoiceItems;
        });
      } else {
        const payload = {
          key: selectedSecondaryService.id,
          roomTenantServiceId: selectedSecondaryService.id,
          name: selectedSecondaryService.name,
          unit: selectedSecondaryService.unit,
          cost: selectedSecondaryService.cost,
          quantity: parseInt(quantity),
        };
        setServiceInvoiceItems([...serviceInvoiceItems, payload]);
      }
    } catch (error: any) {
      Alert.alert(
        t(`alertTitle.noti`),
        (error as ErrorResponseAxios).response.data.message,
      );
    } finally {
      handleFinally();
    }
  };

  const handleFinally = () => {
    setSelectedSecondaryService(null);
    setCurrentSecondarySerivceName('');
    setQuantity('');
    setModalOpen(false);
  };

  const handleSelectService = (value: string) => {
    setCurrentSecondarySerivceName(value);
    const index = roomServices.findIndex(s => s.id === value);
    const service = roomServices[index];
    setSelectedSecondaryService(service);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalOpen}
      maskClosable
      onClose={() => handleFinally()}
      footer={[
        {
          text: t('actions.cancel'),
          onPress: () => {},
          style: {color: appColors.danger},
        },
        {
          text: t('actions.addMore'),
          onPress: () => handleAddInvoiceItem(),
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

            {selectedSecondaryService?.name == 'electric' ||
            (selectedSecondaryService?.name == 'water' &&
              selectedSecondaryService?.unit == 'm3') ? (
              <View>
                <View style={{width: '100%', marginTop: -16}}>
                  <InputComponent
                    placeholder={t('placeholders.oldIndicator')}
                    type="numeric"
                    value={oldIndicator}
                    onChange={value => {
                      if (value === '') {
                        setOldIndicator(value);
                      }
                      if (isNumeric(value)) {
                        setOldIndicator(value);
                      }
                    }}
                  />
                </View>
                <View style={{width: '100%', marginTop: -16}}>
                  <InputComponent
                    placeholder={t('placeholders.newIndicator')}
                    type="numeric"
                    value={newIndicator}
                    onChange={value => {
                      if (value === '') {
                        setNewIndicator(value);
                      }
                      if (isNumeric(value)) {
                        setNewIndicator(value);
                      }
                    }}
                  />
                </View>
              </View>
            ) : (
              <View style={{width: '100%', marginTop: -16}}>
                <InputComponent
                  placeholder={t('placeholders.quantity')}
                  type="numeric"
                  value={quantity}
                  onChange={value => {
                    if (value === '') {
                      setQuantity(value);
                    }
                    if (isNumeric(value)) {
                      setQuantity(value);
                    }
                  }}
                />
              </View>
            )}
          </>
        </View>
      </View>
    </Modal>
  );
};

export default CreateInvoiceItemModal;
