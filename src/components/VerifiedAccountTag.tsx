import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import TextComponent from './TextComponent';
import { appColors } from '@const/appColors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface VerifiedAccountTagProps {
    isVerified: boolean
}

const VerifiedAccountTag: React.FC<VerifiedAccountTagProps> = ({ isVerified }) => {
    const { t } = useTranslation();
    const TagColor = () => {
        switch (isVerified) {
            case true:
                return appColors.success;
            case false:
                return appColors.danger;
            default:
                return appColors.black;
        }
    };
    const TagBackgroundColor = () => {
        switch (isVerified) {
            case true:
                return appColors.successBackground;
            case false:
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
                {isVerified == true ? t(`accountDetail.verified`) : t(`accountDetail.notVerified`)}
            </TextComponent>
        </View>
    );
};

export default VerifiedAccountTag;
