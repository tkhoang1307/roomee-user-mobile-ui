import {View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';

import {TextComponent} from '@components/index';
import {PropertyStatus} from '@const/property';
import {appColors} from '@const/appColors';

interface IPropertyStatusTagProps {
  status: string;
}

const PropertyStatusTag: React.FC<IPropertyStatusTagProps> = ({status}) => {
  const {t} = useTranslation();
  const TagColor = () => {
    switch (status) {
      case PropertyStatus.GOOD:
        return appColors.success;
      case PropertyStatus.DAMAGE:
        return appColors.danger;
      case PropertyStatus.MISSING:
        return appColors.warning;
      case PropertyStatus.REPAIRING:
        return appColors.info;
      default:
        return appColors.black;
    }
  };
  const TagBackgroundColor = () => {
    switch (status) {
      case PropertyStatus.GOOD:
        return appColors.successBackground;
      case PropertyStatus.DAMAGE:
        return appColors.dangerBackground;
      case PropertyStatus.MISSING:
        return appColors.warningBackground;
      case PropertyStatus.REPAIRING:
        return appColors.infoBackground;
      default:
        return appColors.white;
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
      <Icon name="tag-outline" size={15} color={TagColor()} />
      <TextComponent color={TagColor()}>
        {t(`room.propertyStatus.${status.toLowerCase()}`)}
      </TextComponent>
    </View>
  );
};

export default PropertyStatusTag;
