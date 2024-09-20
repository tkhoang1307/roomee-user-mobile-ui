import {
  Image,
  ImageProps,
  StyleProp,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {ReactNode, useRef} from 'react';
import ImageCropPicker, {
  ImageOrVideo,
  Options,
} from 'react-native-image-crop-picker';
import {Portal} from 'react-native-portalize';
import {Modalize} from 'react-native-modalize';
import {useTranslation} from 'react-i18next';
import {IconOutline} from '@ant-design/icons-react-native';

import {appColors} from '@const/appColors';
import RowComponent from './RowComponent';
import SpaceComponent from './SpaceComponent';
import TextComponent from './TextComponent';
import {extractFileNameFromPath} from '@utils/extractFileNameFromPath';
import {IImageUri} from '@models/room';
import IconCircleComponent from './IconCircleComponent';

export interface Props {
  listImageUri?: IImageUri[];
  setListImageUri?: React.Dispatch<React.SetStateAction<IImageUri[]>>;
  imageUri?: IImageUri;
  setImageUri?: React.Dispatch<React.SetStateAction<IImageUri>>;
  size?: number;
  styles?: StyleProp<ImageProps>;
  onPress?: () => void;
  maxImage?: number;
}

export const UploadImageComponent = (props: Props) => {
  const {
    listImageUri,
    setListImageUri,
    imageUri,
    setImageUri,
    size,
    styles,
    maxImage,
  } = props;

  const {t} = useTranslation();

  const modalizeRef = useRef<Modalize>();

  const options: Options = {
    cropping: true,
    mediaType: 'photo',
    cropperCircleOverlay: false,
    enableRotationGesture: true,
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
      styles={{marginBottom: 10}}
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
            listImageUri && handleListFileSelected(res);
            imageUri && handleFileSelected(res);
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
            listImageUri && handleListFileSelected(res);
            imageUri && handleFileSelected(res);
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

  const handleListFileSelected = async (val: ImageOrVideo) => {
    const basename = extractFileNameFromPath(val.path);
    const photo = {
      uid: val.modificationDate || '',
      uri: val.path,
      type: val.mime,
      name: basename,
      size: val.size,
    };
    setListImageUri && setListImageUri(prev => [...prev, photo]);
    // const formData = new FormData();
    // formData.append('file', photo);
  };

  const handleFileSelected = async (val: ImageOrVideo) => {
    const basename = extractFileNameFromPath(val.path);
    const photo = {
      uid: '-1',
      uri: val.path,
      type: val.mime,
      name: basename,
      size: val.size,
    };
    setImageUri && setImageUri(photo);
  };

  const handleDeleteImage = (uid: string) => {
    setListImageUri &&
      setListImageUri(prev => prev.filter(item => item.uid !== uid));
  };

  const listImageView = listImageUri?.map((item, index) => (
    <View key={index} style={{position: 'relative'}}>
      <Image
        source={{uri: item.uri}}
        style={[
          styles,
          {
            width: size,
            height: size,
            objectFit: 'cover',
            marginRight: 20,
            marginBottom: 10,
          },
        ]}
      />
      <TouchableOpacity
        onPress={() => {
          handleDeleteImage(item.uid);
        }}
        style={{position: 'absolute', right: 12, top: -5}}>
        <IconCircleComponent name="close" sizeCircle={20} sizeIcon={15} />
      </TouchableOpacity>
    </View>
  ));

  return (
    <View>
      {listImageUri && listImageUri.length > 0 ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
          }}>
          {listImageView}
          <TouchableOpacity onPress={() => modalizeRef.current?.open()}>
            <View
              style={{
                width: size,
                height: size,
                backgroundColor: appColors.gray5,
                borderStyle: 'dashed',
                borderWidth: 0.7,
                borderRadius: 4,
                justifyContent: 'center',
                alignItems: 'center',
                // display:
                //   listImageUri && listImageUri?.length === maxImage
                //     ? 'none'
                //     : 'flex',
              }}>
              <IconOutline name="plus" />
              <TextComponent text="Upload" />
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={() => modalizeRef.current?.open()}>
          <View
            style={{
              width: size,
              height: size,
              backgroundColor: appColors.gray5,
              borderStyle: 'dashed',
              borderWidth: 0.7,
              borderRadius: 4,
              justifyContent: 'center',
              alignItems: 'center',
              display:
                listImageUri && listImageUri?.length === maxImage
                  ? 'none'
                  : 'flex',
            }}>
            <IconOutline name="plus" />
            <TextComponent text="Upload" />
          </View>
        </TouchableOpacity>
      )}

      {imageUri && imageUri.uri !== null && (
        <View>
          <Image
            source={{uri: imageUri.uri}}
            style={[styles, {width: size, height: size, objectFit: 'cover'}]}
          />
          <TouchableOpacity onPress={() => modalizeRef.current?.open()}>
            <View
              style={{
                width: size,
                height: size,
                backgroundColor: appColors.gray5,
                borderStyle: 'dashed',
                borderWidth: 0.7,
                borderRadius: 4,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <IconOutline name="plus" />
              <TextComponent text="Upload" />
            </View>
          </TouchableOpacity>
        </View>
      )}

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
