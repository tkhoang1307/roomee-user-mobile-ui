import {View} from 'react-native';
import React, {ReactNode, useRef} from 'react';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import ImageCropPicker, {
  ImageOrVideo,
  Options,
} from 'react-native-image-crop-picker';
import {useTranslation} from 'react-i18next';
import {IconOutline} from '@ant-design/icons-react-native';

import {ButtonComponent, RowComponent, SpaceComponent, TextComponent} from '.';
import {appColors} from '@const/appColors';

interface Props {
  onSelect: (val: {type: 'file'; value: string | ImageOrVideo}) => void;
  title?: string;
  cropCircle?: boolean;
}

const ButtonImagePicker = (props: Props) => {
  const {onSelect, title, cropCircle} = props;
  const {t} = useTranslation();

  const modalizeRef = useRef<Modalize>();

  const options: Options = {
    cropping: true,
    mediaType: 'photo',
    cropperCircleOverlay: cropCircle === false ? false : true,
    enableRotationGesture: true,
    freeStyleCropEnabled: true,
  };

  const choiceImages = [
    {
      key: 'camera',
      title: t('actions.takePicture'),
      icon: <IconOutline name="camera" size={22} color={appColors.text} />,
    },
    {
      key: 'library',
      title: t('actions.fromLib'),
      icon: <IconOutline name="file-image" size={22} color={appColors.text} />,
    },
  ];

  const renderItem = (item: {icon: ReactNode; key: string; title: string}) => (
    <RowComponent
      key={item.key}
      styles={{marginBottom: 20}}
      onPress={() => handleChoiceImage(item.key)}>
      {item.icon}
      <SpaceComponent width={12} />
      <TextComponent text={item.title} flex={1} />
    </RowComponent>
  );

  const handleChoiceImage = (key: string) => {
    switch (key) {
      case 'library':
        ImageCropPicker.openPicker(options)
          .then(res => {
            onSelect({type: 'file', value: res});
          })
          .catch((error: any) => {
            if (error.code === 'E_PICKER_CANCELLED') {
              return false;
            }
          });
        break;

      case 'camera':
        ImageCropPicker.openCamera(options)
          .then(res => {
            onSelect({type: 'file', value: res});
          })
          .catch((error: any) => {
            if (error.code === 'E_PICKER_CANCELLED') {
              return false;
            }
          });
        break;
      default:
        break;
    }

    modalizeRef.current?.close();
  };

  return (
    <View style={{marginBottom: 20}}>
      <ButtonComponent
        text={title ? title : t('actions.uploadImage')}
        onPress={() => modalizeRef.current?.open()}
        type="link"
      />
      <Portal>
        <Modalize
          adjustToContentHeight
          ref={modalizeRef}
          handlePosition="inside">
          <View style={{marginVertical: 30, paddingHorizontal: 20}}>
            {choiceImages.map(item => renderItem(item))}
          </View>
        </Modalize>
      </Portal>
    </View>
  );
};

export default ButtonImagePicker;
