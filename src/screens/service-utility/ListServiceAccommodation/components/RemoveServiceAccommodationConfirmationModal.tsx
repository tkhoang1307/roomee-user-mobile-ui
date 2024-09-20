import {View, Alert} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Modal} from '@ant-design/react-native';

import {serviceUtilityServices} from '@services';
import {TextComponent} from '@components/index';
import {appColors} from '@const/appColors';
import {ErrorResponseAxios} from '@models/error';
import {ServiceAccommodationResponseModel} from '@models/service-utility';

interface RemoveServiceAccommodationConfirmationModalProps {
  accommodationId: string;
  selectedService: ServiceAccommodationResponseModel;
  accommodationServices: Array<ServiceAccommodationResponseModel>;
  setAccommodationServices: React.Dispatch<
    React.SetStateAction<Array<ServiceAccommodationResponseModel>>
  >;
  modalOpenRemove: boolean;
  setModalOpenRemove: React.Dispatch<React.SetStateAction<boolean>>;
}

const RemoveServiceAccommodationConfirmationModal: React.FC<
  RemoveServiceAccommodationConfirmationModalProps
> = ({
  accommodationId,
  selectedService,
  accommodationServices,
  setAccommodationServices,
  modalOpenRemove,
  setModalOpenRemove,
}) => {
  const {t} = useTranslation();

  const handleRemoveServiceAccommodation = async () => {
    try {
      const rowKey = selectedService.id;
      const resDataRemove =
        await serviceUtilityServices.deleteSecondaryServiceForAccommodation(
          accommodationId,
          rowKey,
        );
      if (resDataRemove.status === 204) {
        const newData = [...accommodationServices];
        const prevIndex = accommodationServices.findIndex(
          item => item.id === rowKey,
        );
        newData.splice(prevIndex, 1);
        setAccommodationServices(newData);
      }
    } catch (error: any) {
      Alert.alert(
        t(`alertTitle.noti`),
        (error as ErrorResponseAxios).response.data.message,
      );
    } finally {
      setModalOpenRemove(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalOpenRemove}
      maskClosable
      onClose={() => setModalOpenRemove(false)}
      footer={[
        {
          text: t('actions.cancel'),
          onPress: () => {},
          style: {color: appColors.danger},
        },
        {
          text: t('actions.delete'),
          onPress: () => handleRemoveServiceAccommodation(),
          style: {color: appColors.primary},
        },
      ]}>
      <View style={{width: '100%'}}>
        <TextComponent size={18}>
          {t('descriptions.deleteService', {
            name: t(`service.${selectedService?.name}.name`),
          })}
        </TextComponent>
      </View>
    </Modal>
  );
};

export default RemoveServiceAccommodationConfirmationModal;
