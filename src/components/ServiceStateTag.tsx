import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import TextComponent from './TextComponent';
import { appColors } from '@const/appColors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ServiceStateTagProps {
    deleted: boolean;
}

const ServiceStateTag: React.FC<ServiceStateTagProps> = ({ deleted }) => {
    const { t } = useTranslation();
    const TagColor = () => {
        switch (deleted) {
            case false:
                return appColors.success;
            case true:
                return appColors.danger;
            default:
                return appColors.black;
        }
    };
    const TagBackgroundColor = () => {
        switch (deleted) {
            case false:
                return appColors.successBackground;
            case true:
                return appColors.dangerBackground;
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
            <Icon name="tag-outline" size={14} color={TagColor()} />
            <TextComponent color={TagColor()}>
                {deleted == false ? t(`service.state.active`) : t(`service.state.inactive`)}
            </TextComponent>
        </View>
    );
};

export default ServiceStateTag;
