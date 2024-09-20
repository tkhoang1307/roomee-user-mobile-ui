import { useContext, useEffect, useState } from 'react';
import { Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '@ant-design/react-native';
import { Alert, View } from 'react-native';

import { globalStyles } from '@styles';
import { AbilityContext, Can } from '@context';
import { ServiceContractScreenProps } from '@models/navigators/HomNavigator';
import { AbilityActionEnum, AbilitySubjectEnum } from '@const/abilities';
import CardTitleWithSharp from '@components/CardTitleWithSharp';
import { ServiceRoomResponseModel } from '@models/service-utility';
import { serviceUtilityServices } from '@services';
import { ErrorResponseAxios } from '@models/error';
import { MONEY_FORMAT_BY } from '@const/index';
import TouchableOpacityComponent from '@components/TouchableOpacityComponent';
import { styles } from './styles';
import { SwipeListView } from 'react-native-swipe-list-view';
import DeleteServiceContractSwitch from './components/DeleteServiceContractSwitch';
import AddServiceContractModal from './components/AddServiceContractModal';
import { ServiceTypeEnum } from '@const/service';
import TitleComponent from '@components/TitleComponent';

const ServiceContractScreen: React.FC<ServiceContractScreenProps> = ({ route }) => {
    const { t } = useTranslation();
    const { accommodationId, roomId } = route.params;
    const ability = useContext(AbilityContext);
    const [roomServiceContracts, setRoomServiceContracts] = useState<Array<ServiceRoomResponseModel>>([]);
    const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
    const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<ServiceRoomResponseModel | null>(null);

    useEffect(() => {
        const getAllServicesOfRoom = async () => {
            try {
                const resDataService = await serviceUtilityServices.getAllServicesForRoom(roomId || '', 'ALL');
                setRoomServiceContracts(resDataService);
            } catch (error) {
                Alert.alert(t(`alertTitle.noti`), (error as ErrorResponseAxios).response.data.message);
            }
        };

        getAllServicesOfRoom();
    }, [roomId]);

    useEffect(() => {
        const isPrimaryService = (serviceName: string) => {
            if (serviceName === 'rentalCost' || serviceName === 'electric' || serviceName === 'water') {
                return true;
            } else {
                return false;
            }
        }
        roomServiceContracts.sort((a, b) => {
            if (isPrimaryService(a.name) && !isPrimaryService(b.name)) {
                return -1;
            } else if (!isPrimaryService(a.name) && isPrimaryService(b.name)) {
                return 1;
            }
            if (a.deleted === false && b.deleted === true) {
                return -1;
            } else if (a.deleted === true && b.deleted === false) {
                return 1;
            }
            return b.cost - a.cost;
        });
        setRoomServiceContracts(roomServiceContracts);
    }, [roomServiceContracts]);

    const onRowOpen = (rowKey: string) => {
        console.log('Opened row with key:', rowKey);
    };

    const openEditModal = (_rowMap: any, rowKey: string) => {
        const prevIndex = roomServiceContracts.findIndex((item) => item.id === rowKey);
        setEditingItem(roomServiceContracts[prevIndex]);
        setIsOpenEditModal(true);
    };

    const handleAddServiceContractModal = () => {
        setIsOpenAddModal(true);
    }

    const renderItem = ({ item }: { item: ServiceRoomResponseModel }) => (
        <View style={[styles.itemContainer]}>
            <View style={styles.subItemContainer}>
                <View style={styles.leftContainer}>
                    <Text style={styles.itemText}>{t(`service.${item.name}.name`)}</Text>
                    <Text style={styles.itemTitle}>{item.cost.toString().replace(MONEY_FORMAT_BY, ',')} / {t(`service.${item.name}.unit.${item.unit}`)}</Text>
                </View>
                <View style={styles.centerContainer}>
                    <DeleteServiceContractSwitch
                        roomId={roomId}
                        roomServiceContract={item}
                        setRoomServiceContracts={setRoomServiceContracts}
                        disabled={
                            item.type.toLowerCase() ===
                            ServiceTypeEnum.PRIMARY.toLowerCase() ||
                            !ability.can(
                                AbilityActionEnum.EDIT,
                                AbilitySubjectEnum.ROOM_SERVICE
                            )
                        }
                    />
                </View>
            </View>

        </View>
    );

    const renderHiddenItem = ({ item }: { item: ServiceRoomResponseModel }, rowMap: any) => (
        <View style={styles.hiddenContainer}>
            <TouchableOpacityComponent
                type='primary'
                styles={[styles.hiddenButton, styles.editButton]}
                onPress={() => openEditModal(rowMap, item.id)}
                text={t('actions.edit')}
            />
        </View>
    );

    return (
        <View style={[{ flex: 1, position: 'relative' }]}>
            <TitleComponent
                back
                title={t(`pageTitle.listServices`)}
                titleStyle={{ fontSize: 20, marginTop: -2 }}
            />
            <View style={[styles.container]}>
                <View style={[globalStyles.cardInfo, { marginTop: 8 }]}>
                    <CardTitleWithSharp title={t('subItem.roomContractService')} />

                    <View style={{ paddingHorizontal: 8, paddingVertical: 8, rowGap: 8 }}>
                        <SwipeListView
                            data={roomServiceContracts}
                            renderItem={renderItem}
                            renderHiddenItem={renderHiddenItem}
                            leftOpenValue={0}
                            rightOpenValue={-75}
                            previewRowKey={'0'}
                            previewOpenValue={-40}
                            previewOpenDelay={3000}
                            onRowDidOpen={onRowOpen}
                            scrollEnabled={false}
                        />

                        <Can I={AbilityActionEnum.CREATE} a={AbilitySubjectEnum.TENANT}>
                            <Button type="primary" onPress={handleAddServiceContractModal}>
                                {t('actions.addService')}
                            </Button>
                        </Can>
                    </View>
                    {isOpenAddModal && (
                        <AddServiceContractModal
                            roomId={roomId}
                            accommodationId={accommodationId}
                            roomServiceContracts={roomServiceContracts}
                            setRoomServiceContracts={setRoomServiceContracts}
                            isOpenAddModal={isOpenAddModal}
                            setIsOpenAddModal={setIsOpenAddModal}
                        />
                    )}
                </View>
            </View>
        </View>
    );
};

export default ServiceContractScreen;
