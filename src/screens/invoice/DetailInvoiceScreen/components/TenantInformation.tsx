import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import TextComponent from '@components/TextComponent';
import { styles } from '../styles';
import { formatPhoneNumber } from '@utils/stringHelpers';
import { useContext, useMemo } from 'react';
import { TenantModel } from '@models/tenant';
import { CurAccomContext } from '@context';

interface TenantInformationProps {
    roomId: string;
    tenants: Array<TenantModel>
}

const TenantInformation: React.FC<TenantInformationProps> = ({
    roomId,
    tenants,
}) => {
    const { t } = useTranslation();
    const { curAccom: accommodation } = useContext(CurAccomContext);

    const currentRoom = useMemo(() => {
        return accommodation.rooms?.find((room) => room.id === roomId);
    }, [accommodation]);

    const tenantLeader = useMemo(() => {
        return tenants.find(
            (tenant) => tenant.isRoomLeader === true
        );
    }, [tenants]);

    return (
        <View style={{}}>
            <View style={styles.headerInvoice}>
                <View style={styles.headerInvoiceItemLeft}>
                    <TextComponent styles={styles.itemTitle}>{t('invoice.billTo')}</TextComponent>
                </View>
            </View>
            <View style={styles.headerInvoice}>
                <View style={styles.headerInvoiceItemLeft}>
                    <TextComponent styles={[styles.itemText, { fontSize: 14 }]}>
                        {t('invoice.room')} {currentRoom?.name} - {t('invoice.floor')}{' '}
                        {currentRoom?.name.charAt(1)} - {t('invoice.accommodation')}{' '}
                        {accommodation.name}</TextComponent>
                </View>
            </View>
            <View style={styles.headerInvoice}>
                <View style={styles.headerInvoiceItemLeft}>
                    <TextComponent styles={[styles.itemTitle, { fontSize: 14 }]}>
                        {t('tenantInfomation.tenant')}:{' '}
                    </TextComponent>
                    <TextComponent styles={[styles.itemText, { fontSize: 14 }]}>

                        {tenantLeader
                            ? tenantLeader?.identityCards[0].name
                            : t('tenantInfomation.updating')}
                    </TextComponent>
                </View>
            </View>
            <View style={styles.headerInvoice}>
                <View style={styles.headerInvoiceItemLeft}>
                    <TextComponent styles={[styles.itemTitle, { fontSize: 14 }]}>
                        {t('tenantInfomation.phoneNumber')}:{' '}
                    </TextComponent>
                    <TextComponent styles={[styles.itemText, { fontSize: 14 }]}>

                        {tenantLeader
                            ? formatPhoneNumber(tenantLeader?.phoneNumber)
                            : t('tenantInfomation.updating')}
                    </TextComponent>
                </View>
            </View>
            <View style={styles.headerInvoice}>
                <View style={styles.headerInvoiceItemLeft}>
                    <TextComponent styles={[styles.itemTitle, { fontSize: 14 }]}>
                        {t('tenantInfomation.email')}:{' '}
                    </TextComponent>
                    <TextComponent styles={[styles.itemText, { fontSize: 14 }]}>
                        {tenantLeader ? tenantLeader?.email : t('tenantInfomation.updating')}
                    </TextComponent>
                </View>
            </View>
        </View>
    );
};

export default TenantInformation;
