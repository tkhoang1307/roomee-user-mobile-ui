import {View, Alert, TextInput} from 'react-native';
import React, {useState} from 'react';
import {Modal} from '@ant-design/react-native';
import {RoomPropertyModel, RoomPropertyUpdateModel} from '@models/room';
import {useTranslation} from 'react-i18next';
import {DividerComponent, InputComponent} from '@components/index';
import SelectPropertyStatus from './SelectPropertyStatus';
import {PropertyStatus} from '@const/property';
import {appColors} from '@const/appColors';
import {roomService} from '@services';

interface DetailPropertyModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editable?: boolean;
  property: RoomPropertyModel;
  setListRoomProperties?: React.Dispatch<
    React.SetStateAction<RoomPropertyModel[]>
  >;
}

const DetailPropertyModal: React.FC<DetailPropertyModalProps> = ({
  open,
  setOpen,
  property,
  setListRoomProperties,
}) => {
  const {t} = useTranslation();
  const [nameProperty, setNameProperty] = useState(property.name);

  const [quantity, setQuantity] = useState(property.quantity.toString());

  const [status, setStatus] = useState<PropertyStatus>(
    property.status as PropertyStatus,
  );
  const [notes, setNotes] = useState(property.notes);

  const handleEditProperty = async () => {
    const payload: RoomPropertyUpdateModel = {
      name: nameProperty,
      quantity: parseInt(quantity),
      status: status,
      notes: notes,
    };

    try {
      const resData = await roomService.updateRoomProperty(
        property.id,
        property.roomId,
        payload,
      );
      setListRoomProperties &&
        setListRoomProperties(prev => {
          const index = prev.findIndex(item => item.id === property.id);
          if (index !== -1) {
            prev[index] = resData;
          }
          return [...prev];
        });

      setNameProperty(resData.name);
      setQuantity(resData.quantity.toString());
      setStatus(resData.status as PropertyStatus);
      setNotes(resData.notes);
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

  const handleExit = () => {
    setNameProperty(property.name);
    setQuantity(property.quantity.toString());
    setStatus(property.status as PropertyStatus);
    setNotes(property.notes);
    setOpen(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={open}
      maskClosable
      onClose={() => setOpen(false)}
      footer={[
        {
          text: t('actions.cancel'),
          onPress: () => handleExit(),
          style: {color: appColors.danger},
        },
        {
          text: t('actions.addMore'),
          onPress: () => handleEditProperty(),
          style: {color: appColors.primary},
        },
      ]}>
      <View
        style={{
          height: 400,
        }}>
        <InputComponent
          label={t('label.nameProperty')}
          value={nameProperty}
          onChange={val => setNameProperty(val)}
        />
        <DividerComponent width={'100%'} />
        <InputComponent
          label={t('label.quantity')}
          value={quantity}
          numeric
          onChange={val => setQuantity(isNaN(+val) ? quantity : val)}
        />
        <DividerComponent width={'100%'} />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}>
          <SelectPropertyStatus
            value={status}
            setValue={setStatus}
            type="select"
            loading={false}
            isEnd={true}
          />
        </View>
        <DividerComponent width={'100%'} />
        <View>
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
            value={notes}
            onChangeText={val => {
              setNotes(val);
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default DetailPropertyModal;
