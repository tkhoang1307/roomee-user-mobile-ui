import {View, Dimensions, StyleProp, ViewStyle} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Modal} from '@ant-design/react-native';
import {useTranslation} from 'react-i18next';

import TextComponent from './TextComponent';
import {appColors} from '@const/appColors';
import IconCircleComponent from './IconCircleComponent';
import {fontFamilies} from '@const/fontFamilies';
import ButtonComponent from './ButtonComponent';
import SpaceComponent from './SpaceComponent';
import {NotiType} from '@models/globalComponent/ModalNotiType';

interface ModalNotiComponentProps {
  title: string;
  content: string;
  type: NotiType;
  circleSize?: number;
  iconSize?: number;
  textButtonCancel?: string;
  buttonCancelStyles?: StyleProp<ViewStyle>;
  textButtonConfirm?: string;
  buttonConfirmStyles?: StyleProp<ViewStyle>;
  onCancel?: () => void;
  onConfirm?: () => void;
  visiable: boolean;
  loading?: boolean;
}

const ModalNotiComponent: React.FC<ModalNotiComponentProps> = ({
  title,
  content,
  type,
  circleSize,
  iconSize,
  textButtonCancel,
  buttonCancelStyles,
  textButtonConfirm,
  buttonConfirmStyles,
  onCancel,
  onConfirm,
  visiable,
  loading,
}) => {
  const {t} = useTranslation();

  let NotiIconName = '';
  let NotiIconTheme = '';

  switch (type) {
    case NotiType.FAIL:
      NotiIconName = 'close';
      NotiIconTheme = appColors.danger;
      break;
    case NotiType.SUCCESS:
      NotiIconName = 'check';
      NotiIconTheme = appColors.success;
      break;
    case NotiType.WARNING:
      NotiIconName = 'alert-circle';
      NotiIconTheme = appColors.warning;
      break;
    case NotiType.DANGEROUS_DECISION:
      NotiIconName = 'alert';
      NotiIconTheme = appColors.danger;
      break;
    case NotiType.INFO:
      NotiIconName = 'information-variant';
      NotiIconTheme = appColors.info;
      break;
    default:
      NotiIconName = 'information-variant';
      NotiIconTheme = appColors.info;
      break;
  }

  return (
    <Modal
      animationType={'slide'}
      visible={visiable}
      transparent={true}
      maskClosable
      onClose={() => {
        if (onCancel) onCancel();
      }}
      style={{width: Dimensions.get('window').width * 0.9}}>
      <View>
        <View style={{alignItems: 'center'}}>
          {type === NotiType.WARNING || type === NotiType.DANGEROUS_DECISION ? (
            <Icon name={NotiIconName} size={70} color={NotiIconTheme} />
          ) : (
            <IconCircleComponent
              name={NotiIconName}
              sizeCircle={circleSize && 60}
              sizeIcon={iconSize && 30}
              colorCircle={NotiIconTheme}
            />
          )}
        </View>
        <View style={{alignItems: 'center', marginTop: 10}}>
          <TextComponent
            text={title}
            styles={{fontFamily: fontFamilies.bold}}
          />
          <TextComponent text={content} />
        </View>
        <SpaceComponent height={40} />

        {type === NotiType.DANGEROUS_DECISION || type === NotiType.WARNING ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
            <ButtonComponent
              text={textButtonCancel || t('actions.cancel')}
              type="primary"
              styles={[
                {
                  width: Dimensions.get('window').width * 0.3,
                  marginBottom: 0,
                  backgroundColor: appColors.gray,
                },
                buttonCancelStyles,
              ]}
              // textStyles={{marginBottom: 10}}
              onPress={() => {
                onCancel && onCancel();
              }}
            />
            <ButtonComponent
              loading={loading}
              text={textButtonConfirm || t('actions.ok')}
              type="primary"
              styles={[
                {
                  width: Dimensions.get('window').width * 0.3,
                  marginBottom: 0,
                  backgroundColor:
                    type === NotiType.DANGEROUS_DECISION
                      ? appColors.danger
                      : appColors.primary,
                },
                buttonConfirmStyles,
              ]}
              onPress={() => {
                onConfirm && onConfirm();
              }}
            />
          </View>
        ) : (
          <ButtonComponent
            onPress={() => {}}
            text={textButtonConfirm || 'OK'}
            type="primary"
            styles={[{marginBottom: 0}, buttonConfirmStyles]}
          />
        )}
      </View>
    </Modal>
  );
};

export default ModalNotiComponent;
