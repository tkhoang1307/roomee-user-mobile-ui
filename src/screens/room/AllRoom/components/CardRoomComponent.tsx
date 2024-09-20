import {TouchableOpacity, View} from 'react-native';
import React, {ReactNode, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';
import {Portal} from 'react-native-portalize';
import {Modalize} from 'react-native-modalize';
import {IconOutline} from '@ant-design/icons-react-native';

import {appColors} from '@const/appColors';
import IconCircleComponent from '@components/IconCircleComponent';
import TextComponent from '@components/TextComponent';
import {fontFamilies} from '@const/fontFamilies';
import {formatPrice} from '@utils/stringHelpers';
import {
  Can,
  DividerComponent,
  ModalNotiComponent,
  RowComponent,
  SpaceComponent,
} from '@components/index';
import {AccomRoomModel} from '@models/accommodation';
import {NotiType} from '@models/globalComponent/ModalNotiType';
import {AllRoomStyles} from '../styles';
import {AbilityActionEnum, AbilitySubjectEnum} from '@const/abilities';

interface CardRoomComponentProps {
  room: AccomRoomModel;
  onPress: () => void;
  navigation: any;
}

const CardRoomComponent: React.FC<CardRoomComponentProps> = ({
  room,
  onPress,
  navigation,
}) => {
  const {t} = useTranslation();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const onPressMoreVert = () => {
    modalizeRef.current?.open();
  };
  const handleDeleteRoom = () => {};
  const modalizeRef = useRef<Modalize>();
  const choiceBars = [
    {
      key: 'edit',
      title: t('actions.edit'),
      icon: <IconOutline name="edit" size={22} color={appColors.text} />,
    },
    {
      key: 'delete',
      title: t('actions.delete'),
      icon: <IconOutline name="delete" size={22} color={appColors.text} />,
    },
  ];
  const renderItem = (item: {icon: ReactNode; key: string; title: string}) => (
    <RowComponent
      key={item.key}
      styles={{marginBottom: 20}}
      onPress={() => handleChoiceRoom(item.key)}>
      {item.icon}
      <SpaceComponent width={12} />
      <TextComponent text={item.title} flex={1} />
    </RowComponent>
  );

  const handleChoiceRoom = (key: string) => {
    switch (key) {
      case 'edit':
        navigation.navigate('EditRoomScreen', {roomID: room.id});
        break;

      case 'delete':
        //TODO: delete room
        setOpenDeleteModal(true);
        break;
      default:
        break;
    }

    modalizeRef.current?.close();
  };

  return (
    <>
      <View
        style={{
          width: '100%',
          backgroundColor:
            room.tenants === 0 ? appColors.danger : appColors.success,
          marginBottom: 20,
          borderRadius: 8,
          overflow: 'hidden',
        }}>
        <View
          style={{
            backgroundColor: appColors.white,
            marginLeft: 5,
            borderRadius: 4,
          }}>
          <TouchableOpacity
            onPress={onPress}
            style={{
              backgroundColor: appColors.white,
              borderRadius: 4,
              zIndex: 1,
            }}>
            {/* TODO: row 1: name and button */}
            <View
              style={{
                marginHorizontal: 12,
                marginVertical: 12,
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <IconCircleComponent
                  name="storefront"
                  colorCircle={appColors.gray2}
                  sizeCircle={40}
                  sizeIcon={20}
                />
                <TextComponent
                  text={room.name}
                  styles={{marginLeft: 10, fontFamily: fontFamilies.semiBold}}
                />
              </View>

              <Can I={AbilityActionEnum.EDIT} a={AbilitySubjectEnum.ROOM}>
                <TouchableOpacity
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 40,
                    backgroundColor: appColors.gray5,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={onPressMoreVert}>
                  <Icon name="dots-vertical" size={20} />
                </TouchableOpacity>
              </Can>
            </View>
            <ModalNotiComponent
              type={NotiType.DANGEROUS_DECISION}
              visiable={openDeleteModal}
              title={t('room.deleteModalTitle')}
              content={t('room.deleteModalContent', {name: room.name})}
              onCancel={() => setOpenDeleteModal(false)}
              onConfirm={async () => {
                handleDeleteRoom();
              }}
            />

            {/* Divider */}
            <DividerComponent width="100%" />

            <View
              style={{
                // borderBlockColor: appColors.gray2,
                borderWidth: 0.2,
                marginHorizontal: 12,
                marginVertical: 12,
                borderRadius: 4,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 10,
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon name="tag-outline" size={22} />
                  <TextComponent
                    text={t('label.status')}
                    styles={{marginLeft: 5, fontFamily: fontFamilies.medium}}
                  />
                </View>
                <View
                  style={{
                    backgroundColor: appColors.gray3,
                    borderRadius: 10,
                    paddingHorizontal: 10,
                    paddingBottom: 3,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Icon
                    name="checkbox-blank-circle"
                    size={10}
                    color={room.tenants > 0 ? appColors.success : 'red'}
                  />
                  <TextComponent
                    text={
                      room.tenants > 0
                        ? t('room.hadTenant')
                        : t('room.emptyRoom')
                    }
                    size={12}
                    styles={{marginBottom: 2, marginLeft: 5}}
                  />
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginHorizontal: 12,
                marginVertical: 12,
              }}>
              {/* room cost */}
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name="cash-multiple" size={28} style={{marginRight: 5}} />
                <TextComponent text={formatPrice(room.rentCost) + ' ₫'} />
              </View>
              {/* area */}
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name="aspect-ratio" size={25} style={{marginRight: 5}} />
                <TextComponent text={room.area + 'm²'} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <Portal>
        <Modalize
          adjustToContentHeight
          ref={modalizeRef}
          handlePosition="inside">
          <View style={AllRoomStyles.modalizeStyle}>
            <RowComponent
              styles={{justifyContent: 'space-between', marginBottom: 10}}>
              <RowComponent>
                <IconCircleComponent
                  name="format-list-bulleted"
                  sizeIcon={25}
                  sizeCircle={40}
                  colorIcon={appColors.text}
                  colorCircle={appColors.gray2}
                  styles={{marginRight: 10}}
                />
                <TextComponent
                  text={room.name}
                  size={18}
                  styles={{fontFamily: fontFamilies.medium}}
                />
              </RowComponent>
              <TouchableOpacity
                onPress={() => {
                  modalizeRef.current?.close();
                }}>
                <IconCircleComponent
                  name="close"
                  sizeIcon={25}
                  sizeCircle={40}
                  colorIcon={appColors.text}
                  colorCircle={appColors.gray2}
                  // styles={{backgroundColor: appColors.text}}
                />
              </TouchableOpacity>
            </RowComponent>
            <DividerComponent width="100%" />
            {choiceBars.map(item => renderItem(item))}
          </View>
        </Modalize>
      </Portal>
    </>
  );
};

export default CardRoomComponent;
