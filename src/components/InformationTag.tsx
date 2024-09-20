import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import TextComponent from './TextComponent';
import {appColors} from '@const/appColors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TagTypeEnum} from '@const/index';

interface InformationTagProps {
  typeTag?: TagTypeEnum;
  content: string;
}

const InformationTag: React.FC<InformationTagProps> = ({typeTag, content}) => {
  const {t} = useTranslation();
  const TagColor = () => {
    switch (typeTag) {
      case TagTypeEnum.WARNING:
        return appColors.warning;
      case TagTypeEnum.INFORMATION:
        return appColors.info;
      case TagTypeEnum.SUCCESS:
        return appColors.success;
      case TagTypeEnum.DANGER:
        return appColors.danger;
      default:
        return appColors.black;
    }
  };
  const TagBackgroundColor = () => {
    switch (typeTag) {
      case TagTypeEnum.WARNING:
        return appColors.warningBackground;
      case TagTypeEnum.INFORMATION:
        return appColors.infoBackground;
      case TagTypeEnum.SUCCESS:
        return appColors.successBackground;
      case TagTypeEnum.DANGER:
        return appColors.dangerBackground;
      default:
        return appColors.white;
    }
  };
  const TagIcon = () => {
    switch (typeTag) {
      case TagTypeEnum.WARNING:
        return 'information-outline';
      case TagTypeEnum.INFORMATION:
        return 'information-outline';
      case TagTypeEnum.SUCCESS:
        return 'information-outline';
      case TagTypeEnum.DANGER:
        return 'information-outline';
      default:
        return 'tag-outline';
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 4,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: TagColor(),
        padding: 4,
        backgroundColor: TagBackgroundColor(),
      }}>
      <Icon name={TagIcon()} size={15} color={TagColor()} />
      <TextComponent color={TagColor()} styles={{paddingRight: 15}}>
        {content}
      </TextComponent>
    </View>
  );
};

export default InformationTag;
