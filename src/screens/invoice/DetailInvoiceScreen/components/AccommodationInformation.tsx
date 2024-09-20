import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import TextComponent from '@components/TextComponent';
import { styles } from '../styles';
import { useDetailAccommodation } from '@hk/useAccommodation';
import { formatPhoneNumber } from '@utils/stringHelpers';

interface AccommodationInformationProps {
    accommodationId: string,
}

const AccommodationInformation: React.FC<AccommodationInformationProps> = ({
    accommodationId,
}) => {
    const { t } = useTranslation();
    const { accommodation } = useDetailAccommodation(accommodationId || '');

    return (
        <View style={{}}>
            <View style={styles.headerInvoice}>
                <View style={styles.headerInvoiceItemRight}>
                    <TextComponent styles={styles.itemTitle}>{t('invoice.ownerInformation')}</TextComponent>
                </View>
            </View>
            <View style={styles.headerInvoice}>
                <View style={styles.headerInvoiceItemRight}>
                    <TextComponent styles={[styles.itemText, { fontSize: 14 }]}>{accommodation.owner.name}</TextComponent>
                </View>
            </View>
            <View style={styles.headerInvoice}>
                <View style={styles.headerInvoiceItemRight}>
                    <TextComponent styles={[styles.itemText, { fontSize: 14 }]}>{accommodation.owner.username}</TextComponent>
                </View>
            </View>
            <View style={styles.headerInvoice}>
                <View style={styles.headerInvoiceItemRight}>
                    <TextComponent styles={[styles.itemText, { fontSize: 14 }]}>{formatPhoneNumber(accommodation.owner.phoneNumber)}</TextComponent>
                </View>
            </View>
        </View>
    );
};

export default AccommodationInformation;
