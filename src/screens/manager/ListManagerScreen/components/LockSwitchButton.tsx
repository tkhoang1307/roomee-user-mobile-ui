import { View, Alert } from 'react-native';
import { Switch } from '@ant-design/react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { ownerService } from '@services';
import { ErrorResponseAxios } from '@models/error';
import { SwitchButtonStyles } from '../styles';
import { UserDetailModel } from '@models/user';

interface LockSwitchButtonProps {
    manager: UserDetailModel;
    setManagers: React.Dispatch<React.SetStateAction<Array<UserDetailModel>>>;
}

const LockSwitchButton: React.FC<LockSwitchButtonProps> = ({
    manager,
    setManagers
}) => {
    const { t } = useTranslation();

    const handleApplyAccount = async () => {
        try {
            const payload = {
                locked: !manager.locked
            }

            const resDataLockUser = await ownerService.lockManagerAccount(manager.id, payload);
            if (resDataLockUser !== undefined || resDataLockUser !== null) {
                setManagers((prevUsers) => {
                    const updatedUserIndex = prevUsers.findIndex((u) => u.id === manager.id);
                    if (updatedUserIndex !== -1) {
                        const updatedUsers = [...prevUsers];
                        updatedUsers[updatedUserIndex] = {
                            ...updatedUsers[updatedUserIndex],
                            locked: !manager.locked,
                        };
                        return updatedUsers;
                    }
                    return prevUsers;
                });
            }
        } catch (error) {
            Alert.alert(t(`alertTitle.noti`), (error as ErrorResponseAxios).response.data.message);
        } finally {
        }
    };

    return (
        <View style={SwitchButtonStyles.switchContainer}>
            <Switch
                checked={!manager.locked}
                onChange={handleApplyAccount}
                style={!manager.locked ? SwitchButtonStyles.toggleCheckStyle : SwitchButtonStyles.toggleClosedStyle}
            />
        </View>
    );
};

export default LockSwitchButton;
