import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import TextComponent from './TextComponent';
import { appColors } from '@const/appColors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface InvoiceStateTagProps {
    state?: string;
}

const InvoiceStateTag: React.FC<InvoiceStateTagProps> = ({ state }) => {
    const { t } = useTranslation();
    const TagColor = () => {
        switch (state) {
            case 'UN_PAID':
                return appColors.warning;
            case 'PARTIAL_PAID':
                return appColors.info;
            case 'PAID':
                return appColors.success;
            case 'DRAFT':
                return appColors.danger;
            default:
                return appColors.black;
        }
    };
    const TagBackgroundColor = () => {
        switch (state) {
            case 'UN_PAID':
                return appColors.warningBackground;
            case 'PARTIAL_PAID':
                return appColors.infoBackground;
            case 'PAID':
                return appColors.successBackground;
            case 'DRAFT':
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
            <Icon name="tag-outline" size={15} color={TagColor()} />
            <TextComponent color={TagColor()}>
                {t(`state.invoice.${state}`)}
            </TextComponent>
        </View>
    );
};

export default InvoiceStateTag;
