import {View, TouchableOpacity} from 'react-native';
import React, {useContext, useState} from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import {Button, Modal} from '@ant-design/react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {AbilityContext, Can} from '@context';
import {RoomPropertyModel} from '@models/room';
import {RootStackParamList} from '@models/navigators/HomNavigator';
import {globalStyles} from '@styles';
import {appColors} from '@const/appColors';
import {TextComponent} from '@components/index';
import {fontFamilies} from '@const/fontFamilies';
import {AbilityActionEnum, AbilitySubjectEnum} from '@const/abilities';
import PropertyStatusTag from './PropertyStatusTag';
import DetailPropertyModal from './DetailPropertyModal';
import DeletePropertyModal from './DeletePropertyModal';

interface IBasicRoomPropertyCardProps {
  property: RoomPropertyModel;
  roomId: string;
  setListRoomProperties: React.Dispatch<
    React.SetStateAction<RoomPropertyModel[]>
  >;
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'DetailRoomScreen',
    undefined
  >;
}

const BasicRoomPropertyCard: React.FC<IBasicRoomPropertyCardProps> = ({
  roomId,
  property,
  setListRoomProperties,
}) => {
  const {t} = useTranslation();

  const [openMenu, setOpenMenu] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const ability = useContext(AbilityContext);

  return (
    <>
      <View
        style={{
          ...globalStyles.borderInfoStyle,
          width: '100%',
          paddingVertical: 8,
          paddingHorizontal: 12,
          rowGap: 2,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View style={{maxWidth: 200}}>
          <View style={{flexDirection: 'row'}}>
            <TextComponent>{t('label.nameProperty') + ': '}</TextComponent>
            <TextComponent
              styles={{fontFamily: fontFamilies.semiBold}}
              numberOfLine={3}>
              {property.name}
            </TextComponent>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TextComponent>{t('label.quantity') + ': '}</TextComponent>
            <TextComponent styles={{fontFamily: fontFamilies.semiBold}}>
              {property.quantity}
            </TextComponent>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextComponent>{t('label.status') + ': '}</TextComponent>
            {/* status */}
            <PropertyStatusTag status={property.status} />
          </View>
          {!!property.notes && (
            <View style={{flexDirection: 'row'}}>
              <TextComponent>{t('label.notes') + ': '}</TextComponent>
              <TextComponent color={appColors.gray}>
                {property.notes}
              </TextComponent>
            </View>
          )}
        </View>
        <Can I={AbilityActionEnum.EDIT} a={AbilitySubjectEnum.ROOM_PROPERTY}>
          <View>
            <TouchableOpacity
              style={globalStyles.iconButton}
              onPress={() => setOpenMenu(true)}>
              <Icon name="dots-vertical" size={20} />
            </TouchableOpacity>
          </View>
        </Can>
      </View>

      {/* menu */}
      <Modal
        popup
        visible={openMenu}
        maskClosable
        animationType="slide-up"
        onClose={() => setOpenMenu(false)}>
        <View>
          <Button
            style={globalStyles.menuPopupButton}
            onPress={() => {
              setOpenMenu(false);
              setOpenEditModal(true);
            }}>
            {t('actions.editProperty')}
          </Button>
          <Can I={AbilityActionEnum.EDIT} a={AbilitySubjectEnum.ROOM_PROPERTY}>
            <Button
              style={globalStyles.menuPopupButton}
              onPress={() => {
                setOpenMenu(false);
                setOpenDeleteModal(true);
              }}>
              {t('actions.deleteProperty')}
            </Button>
          </Can>
        </View>
        <Button
          type="primary"
          style={globalStyles.closePopupButton}
          onPress={() => setOpenMenu(false)}>
          {t('actions.close')}
        </Button>
      </Modal>

      <DetailPropertyModal
        open={openEditModal}
        property={property}
        setOpen={setOpenEditModal}
        editable={ability.can(
          AbilityActionEnum.EDIT,
          AbilitySubjectEnum.ROOM_PROPERTY,
        )}
        setListRoomProperties={setListRoomProperties}
      />

      <DeletePropertyModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        propertyId={property.id}
        roomId={roomId}
        setListRoomProperties={setListRoomProperties}
      />
    </>
  );
};

export default BasicRoomPropertyCard;
