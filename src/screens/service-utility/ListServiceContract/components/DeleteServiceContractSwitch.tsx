import { View, Alert } from 'react-native';
import { Switch } from '@ant-design/react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { serviceUtilityServices } from '@services';
import { ErrorResponseAxios } from '@models/error';
import { SwitchButtonStyles } from '../styles';
import { ServiceRoomResponseModel } from '@models/service-utility';

interface DeleteServiceContractSwitchProps {
    roomId: string;
    roomServiceContract: ServiceRoomResponseModel;
    setRoomServiceContracts: React.Dispatch<React.SetStateAction<Array<ServiceRoomResponseModel>>>;
    disabled: boolean;
}

const DeleteServiceContractSwitch: React.FC<DeleteServiceContractSwitchProps> = ({
    roomId,
    roomServiceContract,
    setRoomServiceContracts,
    disabled,
}) => {
    const { t } = useTranslation();

    const handleDeleteRoomService = async () => {
        try {
            const payload = {
                roomServiceId: roomServiceContract.id || '',
                roomId: roomId || '',
                deleted: !roomServiceContract.deleted,
            };

            const resDataDeleteRoomService =
                await serviceUtilityServices.updateSecondaryServiceForRoom(payload);
            if (
                resDataDeleteRoomService !== undefined ||
                resDataDeleteRoomService !== null
            ) {
                setRoomServiceContracts((prevRoomServiceContract) => {
                    const updatedRoomServiceIndex = prevRoomServiceContract.findIndex(
                        (u) => u.id === roomServiceContract.id
                    );
                    if (updatedRoomServiceIndex !== -1) {
                        const updatedRoomServices = [...prevRoomServiceContract];
                        updatedRoomServices[updatedRoomServiceIndex] = {
                            ...updatedRoomServices[updatedRoomServiceIndex],
                            deleted: !roomServiceContract.deleted,
                        };
                        return updatedRoomServices;
                    }
                    return prevRoomServiceContract;
                });
            }
        } catch (error: any) {
            Alert.alert(t(`alertTitle.noti`), (error as ErrorResponseAxios).response.data.message);
        }
    };

    return (
        <View style={SwitchButtonStyles.switchContainer}>
            <Switch
                checked={!roomServiceContract.deleted}
                onChange={handleDeleteRoomService}
                style={roomServiceContract.deleted ? SwitchButtonStyles.toggleClosedStyle : SwitchButtonStyles.toggleCheckStyle}
                disabled={disabled}
            />
        </View>
    );
};

export default DeleteServiceContractSwitch;
