import ImageCropPicker, {
  ImageOrVideo,
  Options,
} from 'react-native-image-crop-picker';
import {uniqBy} from 'lodash';
import {useTranslation} from 'react-i18next';
import {Portal} from 'react-native-portalize';
import {Modalize} from 'react-native-modalize';
import ImageModal from 'react-native-image-modal';
import {IconOutline} from '@ant-design/icons-react-native';
import {ReactNode, useCallback, useMemo, useRef} from 'react';
import {Dimensions, TouchableOpacity, View} from 'react-native';

import RowComponent from './RowComponent';
import {appColors} from '@const/appColors';
import TextComponent from './TextComponent';
import SpaceComponent from './SpaceComponent';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface UploadImageProps {
  children?: React.ReactNode;
  options?: Options;
  showResult?: boolean;
  size?: number;
  selectedFiles: ImageOrVideo[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<ImageOrVideo[]>>;
}

const defaultOptions: Options = {
  mediaType: 'photo',
};

const UploadImage: React.FC<UploadImageProps> = ({
  children,
  options,
  showResult,
  size,
  selectedFiles,
  setSelectedFiles,
}) => {
  const {t} = useTranslation();
  const modalizeRef = useRef<Modalize>();

  const selectedOptions = useMemo(
    () => ({...defaultOptions, ...options} as Options),
    [options],
  );

  const imgSize = useMemo(() => {
    if (size) return size;
    return Dimensions.get('screen').width / 3 - 12;
  }, [size]);

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

  const renderItem = useCallback(
    (item: {icon: ReactNode; key: string; title: string}) => (
      <RowComponent
        key={item.key}
        styles={{marginBottom: 20}}
        onPress={() => handleChoiceImage(item.key)}>
        {item.icon}
        <SpaceComponent width={12} />
        <TextComponent text={item.title} flex={1} />
      </RowComponent>
    ),
    [t],
  );

  const handleChoiceImage = (key: string) => {
    switch (key) {
      case 'library':
        ImageCropPicker.openPicker(selectedOptions)
          .then(res => {
            setSelectedFiles(prev => uniqBy([...prev, res].flat(), 'path'));
          })
          .catch((error: any) => {
            if (error.code === 'E_PICKER_CANCELLED') {
              return false;
            }
          });
        break;

      case 'camera':
        ImageCropPicker.openCamera(selectedOptions)
          .then(res => {
            setSelectedFiles(prev => [...prev, res]);
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
    <View
      style={{
        flexDirection: 'row',
        columnGap: 10,
        rowGap: 10,
        flexWrap: 'wrap',
      }}>
      {showResult &&
        selectedFiles.map(f => (
          <View key={f.path}>
            <TouchableOpacity
              onPress={() => {
                setSelectedFiles(prev => prev.filter(i => i.path !== f.path));
              }}
              style={{
                position: 'absolute',
                right: -9,
                top: -9,
                height: 30,
                width: 30,
                borderRadius: 15,
                backgroundColor: 'rgba(57, 52, 52, 0.8)',
                zIndex: 100000000,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon name="close" size={20} color={appColors.white} />
            </TouchableOpacity>
            <ImageModal
              resizeMode="stretch"
              style={{
                width: imgSize,
                height: imgSize,
                borderRadius: 12,
              }}
              source={{uri: f.path}}
              modalImageResizeMode="contain"
            />
          </View>
        ))}
      {children ? (
        <TouchableOpacity onPress={() => modalizeRef.current?.open()}>
          {children}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => modalizeRef.current?.open()}
          style={{
            height: imgSize,
            width: imgSize,
            borderStyle: 'dotted',
            borderWidth: 0.5,
            padding: 12,
            borderRadius: 12,
            backgroundColor: appColors.gray2,
            opacity: 0.8,
          }}>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <TextComponent size={30}>+</TextComponent>
            <TextComponent>{t('actions.uploadImage')}</TextComponent>
          </View>
        </TouchableOpacity>
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

export default UploadImage;
