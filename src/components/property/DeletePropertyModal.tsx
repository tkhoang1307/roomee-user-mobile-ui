import {Alert, View} from 'react-native';
import React from 'react';
import {Modal} from '@ant-design/react-native';
import {useTranslation} from 'react-i18next';

import {appColors} from '@const/appColors';
import {TextComponent} from '@components/index';
import {RoomPropertyModel} from '@models/room';
import {roomService} from '@services';

interface DeletePropertyModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setListRoomProperties: React.Dispatch<
    React.SetStateAction<RoomPropertyModel[]>
  >;
  propertyId: string;
  roomId: string;
}

const DeletePropertyModal: React.FC<DeletePropertyModalProps> = ({
  open,
  setOpen,
  setListRoomProperties,
  propertyId,
  roomId,
}) => {
  const {t} = useTranslation();

  const handleDelete = async () => {
    try {
      await roomService.deleteRoomProperty(propertyId, roomId);
      setListRoomProperties(p => p.filter(p => p.id !== propertyId));
      setOpen(false);
    } catch (error: any) {
      Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
        {
          text: t('actions.cancel'),
          style: 'cancel',
        },
      ]);
    }
  };

  return (
    <Modal
      title={t('actions.deleteProperty')}
      transparent
      maskClosable
      visible={open}
      onClose={() => setOpen(false)}
      footer={[
        {text: t('actions.cancel'), onPress: () => {}},
        {
          text: t('actions.submit'),
          onPress: handleDelete,
          style: {color: appColors.danger},
        },
      ]}>
      <View
        style={{
          width: '100%',
          marginTop: 8,
        }}>
        <TextComponent>{t('descriptions.deleteProperty')}</TextComponent>
      </View>
    </Modal>
  );
};

export default DeletePropertyModal;
