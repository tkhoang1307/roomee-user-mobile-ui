import { appColors } from '@const/appColors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    textAreaContainer: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: appColors.gray2,
        width: '100%',
        padding: 5
    },
    textArea: {
        height: 100,
    },
    portalContainerStyle: {
        minHeight: 400,
        padding: 8,
        rowGap: 8,
    },
});