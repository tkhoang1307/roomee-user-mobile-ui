import {
    View,
    Image,
    TouchableOpacity,
} from 'react-native';
import React, { useMemo, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';

import RowComponent from '@components/RowComponent';
import { TextComponent } from '@components/index';
import { fontFamilies } from '@const/fontFamilies';
import { UserDetailModel } from '@models/user';
import { styles } from '../styles';
import { VerifiedAccountTag } from '@components/index';
import LockSwitchButton from './LockSwitchButton';
import DetailManagerModal from './DetailManagerModal';

interface ManagerCardProps {
    managerInfor: UserDetailModel;
    setManagers: React.Dispatch<React.SetStateAction<Array<UserDetailModel>>>;
}

const ManagerCard = (props: ManagerCardProps) => {
    const { managerInfor, setManagers } = props;
    const { t } = useTranslation();
    const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);

    const genderIcon = useMemo(() => {
        if (managerInfor.imageUrl) {
            return require('../../../../assets/images/male.png');
        }
        return require('../../../../assets/images/male.png');
    }, []);

    return (
        <View>
            <TouchableOpacity style={[styles.container]} onPress={() => setOpenDetailModal(true)}>
                <View style={{ flexGrow: 1, justifyContent: 'center' }}>
                    {managerInfor.imageUrl ? (
                        <Image
                            source={genderIcon}
                            style={{
                                width: 60,
                                height: 60,
                            }}
                        />
                    ) : (
                        <Icon name="account-circle" size={60} />
                    )}
                </View>
                <View style={{ justifyContent: 'space-evenly', flexGrow: 7 }}>
                    <RowComponent
                        styles={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <View>
                            <TextComponent
                                text={managerInfor.name}
                                styles={{ fontFamily: fontFamilies.semiBold }}
                                size={16}
                            />
                            <TextComponent text={`${managerInfor.username}`} size={14} styles={{ marginBottom: 8 }} />
                            <TextComponent
                                text={managerInfor.phoneNumber ?
                                    `${t('tenantInfomation.phoneNumber')}: ${managerInfor.phoneNumber}` :
                                    `${t('tenantInfomation.phoneNumber')}: ${'Đang cập nhật'}`}
                                size={12}
                            />
                            <TextComponent
                                text={managerInfor.birthday ?
                                    `${t('tenantInfomation.dateOfBirth')}: ${managerInfor.birthday}` :
                                    `${t('tenantInfomation.dateOfBirth')}: ${'Đang cập nhật'}`}
                                styles={{ fontFamily: fontFamilies.italic }}
                                size={12}
                            />
                        </View>
                    </RowComponent>
                    <View style={[styles.tagAndToggleGroupStyle]}>
                        <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'flex-start' }}>
                            <VerifiedAccountTag isVerified={managerInfor.emailVerified} />
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <LockSwitchButton manager={managerInfor} setManagers={setManagers} />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            {openDetailModal && (
                <DetailManagerModal
                    openDetailModal={openDetailModal}
                    setOpenDetailModal={setOpenDetailModal}
                    managerId={managerInfor.id}
                />
            )}
        </View>
    );
};

export default ManagerCard;
