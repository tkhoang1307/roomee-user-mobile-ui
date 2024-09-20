import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal, View } from '@ant-design/react-native';
import { Alert, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { globalStyles } from '@styles';
import { ownerService } from '@services';
import InfoTypo from '@components/InforTypo';
import { UserDetailModel } from '@models/user';
import { ErrorResponseAxios } from '@models/error';

interface DetailManagerProps {
    openDetailModal: boolean;
    setOpenDetailModal: React.Dispatch<React.SetStateAction<boolean>>;
    managerId: string;
}

const DetailManagerModal: React.FC<DetailManagerProps> = ({
    openDetailModal,
    setOpenDetailModal,
    managerId,
}) => {
    const { t } = useTranslation();
    const [detailManagerInfor, setDetailManagerInfor] = useState<UserDetailModel>();

    useEffect(() => {
        const getDetailManagerInfo = async (managerId: string) => {
            try {
                const data = await ownerService.getDetailManagerByOwner(managerId);
                setDetailManagerInfor({ ...data });
            } catch (error: any) {
                Alert.alert(t(`alertTitle.noti`), (error as ErrorResponseAxios).response.data.message);
            }
        };

        getDetailManagerInfo(managerId || '');
    }, []);

    return (
        <Modal
            popup
            visible={openDetailModal}
            maskClosable
            animationType="slide-up"
            onClose={() => setOpenDetailModal(false)}>
            <ScrollView style={{ maxHeight: 600 }}>
                <View style={{ paddingHorizontal: 16, paddingVertical: 8, rowGap: 8 }}>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'flex-end',
                        }}>
                        <Icon name="account-outline" size={24} style={{ height: 32 }} />
                        <InfoTypo
                            colon
                            titleStyle={{ fontSize: 20 }}
                            contentStyle={{ fontSize: 20 }}>
                            {detailManagerInfor?.name}
                        </InfoTypo>
                    </View>

                    <View style={globalStyles.InfoContainer}>
                        <Icon name="phone-outline" size={20} />
                        <InfoTypo
                            title={t('tenantInfomation.phoneNumber')}
                            colon
                            containerStyle={globalStyles.InfoContainer}>
                            {detailManagerInfor?.phoneNumber}
                        </InfoTypo>
                    </View>

                    <View style={globalStyles.InfoContainer}>
                        <Icon name="email-outline" size={20} />
                        <InfoTypo
                            title={t('tenantInfomation.email')}
                            colon
                            containerStyle={globalStyles.InfoContainer}>
                            {detailManagerInfor?.username}
                        </InfoTypo>
                    </View>

                    <View style={globalStyles.InfoContainer}>
                        <Icon name="cake-variant-outline" size={20} />
                        <InfoTypo
                            title={t('tenantInfomation.dateOfBirth')}
                            colon
                            containerStyle={globalStyles.InfoContainer}>
                            {detailManagerInfor?.birthday}
                        </InfoTypo>
                    </View>

                    <View style={globalStyles.InfoContainer}>
                        <Icon name="account-group" size={20} />
                        <InfoTypo
                            title={t('placeholders.role')}
                            colon
                            containerStyle={globalStyles.InfoContainer}>
                            {detailManagerInfor?.role}
                        </InfoTypo>
                    </View>

                    <View style={globalStyles.InfoContainer}>
                        <Icon name="account-check-outline" size={20} />
                        <InfoTypo
                            title={t('accountDetail.emailVerify')}
                            colon
                            containerStyle={globalStyles.InfoContainer}>
                            {detailManagerInfor?.emailVerified
                                ? t('accountDetail.verified')
                                : t('accountDetail.notVerified')}
                        </InfoTypo>
                    </View>

                    <View style={globalStyles.InfoContainer}>
                        <Icon name="list-status" size={20} />
                        <InfoTypo
                            title={t('accountDetail.status')}
                            colon
                            containerStyle={globalStyles.InfoContainer}>
                            {detailManagerInfor?.locked
                                ? t('accountDetail.locked')
                                : t('accountDetail.unlocked')}
                        </InfoTypo>
                    </View>
                </View>
            </ScrollView>
            <Button
                type="primary"
                style={globalStyles.closePopupButton}
                onPress={() => setOpenDetailModal(false)}>
                {t('actions.close')}
            </Button>
        </Modal>
    );
};

export default DetailManagerModal;
