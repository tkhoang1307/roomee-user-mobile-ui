import {Alert, ScrollView, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import React, {useContext, useEffect, useState} from 'react';

import {globalStyles} from '@styles';
import {appColors} from '@const/appColors';
import {ContractModel} from '@models/contract';
import {AccomRoomModel} from '@models/accommodation';
import {contractService, roomService} from '@services';
import {getNumberWithOrdinal} from '@utils/stringHelpers';
import {AbilityContext, GlobalConfigContext} from '@context';
import TenantsInfoCard from '@components/tenant/TenantsInfoCard';
import {SectionComponent, TitleComponent} from '@components/index';
import RequestsCarousel from '@components/request/RequestsCarousel';
import ContractInfoCard from '@components/contract/ContractInfoCard';
import {DetailRoomScreenProps} from '@models/navigators/HomNavigator';
import {AbilityActionEnum, AbilitySubjectEnum} from '@const/abilities';
import ServiceContractCard from '@components/service-contract/ServiceContractCard';
import GeneralInfoCard from '@components/contract/GeneralInfoCard';
import ListInvoicesCard from '@screens/invoice/components/ListInvoicesCard';
import RoomPropertyCard from '@components/property/RoomPropertyCard';
import {TenantModel} from '@models/tenant';

const DetailRoomScreen: React.FC<DetailRoomScreenProps> = ({
  navigation,
  route,
}) => {
  const {t} = useTranslation();
  const ability = useContext(AbilityContext);
  const {languageMode} = useContext(GlobalConfigContext);
  const roomId = route.params.roomId;
  const accomId = route.params.accommodationId;
  const roomName = route.params.roomName;
  const floor = route.params.floor;
  const [roomLoading, setRoomLoading] = useState(false);
  const [contract, setContract] = useState<ContractModel>();
  const [contractLoading, setContractLoading] = useState(true);
  const [reloadProperties, setReloadProperties] = useState(false);
  const [reloadContractFlag, setReloadContractFlag] = useState(false);
  const [room, setRoom] = useState<AccomRoomModel>({} as AccomRoomModel);
  const [tenantsRoom, setTenantsRoom] = useState<TenantModel[]>([]);

  useEffect(() => {
    const getDetailRoom = async () => {
      try {
        setRoomLoading(true);
        const detailRoom = await roomService.getDetailRoom(roomId || '');
        setRoom(detailRoom);
      } catch (error: any) {
        Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
          {
            text: t('actions.cancel'),
            style: 'cancel',
          },
        ]);
      } finally {
        setRoomLoading(false);
      }
    };

    getDetailRoom();
  }, [roomId]);

  useEffect(() => {
    const getCurrentContract = async () => {
      try {
        // setContractLoading(true);
        const curContract = await contractService.getCurrentContract(
          roomId || '',
        );
        setContract(curContract);
      } catch (error: any) {
        if (error?.response?.status !== 400) {
          Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
            {
              text: t('actions.cancel'),
              style: 'cancel',
            },
          ]);
        }
      } finally {
        setContractLoading(false);
      }
    };
    getCurrentContract();
  }, [roomId, reloadContractFlag]);

  useEffect(() => {
    const getTenantsRoom = async () => {
      try {
        const res = await roomService.getAllTenantsOfRoom(roomId);
        setTenantsRoom(res);
      } catch (error: any) {
        Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
          {
            text: t('actions.cancel'),
            style: 'cancel',
          },
        ]);
      }
    };
    getTenantsRoom();
  }, [roomId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // do something
      setReloadContractFlag(pre => !pre);
      setReloadProperties(pre => !pre);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={[globalStyles.container, {position: 'relative', rowGap: 8}]}>
      <TitleComponent
        back
        backgroundColor={appColors.backgroundCard}
        title={`${t('label.room')} ${room.name || roomName} - ${
          languageMode.locale === 'en'
            ? `${floor}${getNumberWithOrdinal(floor)} ${t('label.floor')}`
            : `${t('label.floor')} ${floor}`
        }`}
        titleStyle={{fontSize: 16, marginTop: -2}}
      />
      <ScrollView>
        <SectionComponent styles={{rowGap: 8}}>
          <GeneralInfoCard
            loading={roomLoading}
            room={room}
            navigation={navigation}
          />
          <ContractInfoCard
            loading={contractLoading}
            contract={contract}
            room={room}
            editable={ability.can(
              AbilityActionEnum.EDIT,
              AbilitySubjectEnum.CONTRACT,
            )}
            currentContract
            setReloadContractFlag={setReloadContractFlag}
            setContract={setContract}
            navigation={navigation}
            minimal
          />
          <ListInvoicesCard
            loading={contractLoading}
            roomId={roomId}
            accommodationId={room.accommodationId}
            currentContract
            contract={contract}
            navigation={navigation}
            reloadFlag={reloadContractFlag}
          />
          <TenantsInfoCard
            tenants={tenantsRoom}
            setTenants={setTenantsRoom}
            loading={contractLoading}
            contract={contract}
            room={room}
            editable={ability.can(
              AbilityActionEnum.EDIT,
              AbilitySubjectEnum.CONTRACT,
            )}
            currentContract
            setReloadContractFlag={setReloadContractFlag}
            setContract={setContract}
            navigation={navigation}
          />
          <RequestsCarousel
            roomId={roomId}
            accomId={accomId}
            roomName={roomName}
            navigation={navigation}
          />
          <RoomPropertyCard
            navigation={navigation}
            roomId={roomId}
            reloadFlag={reloadProperties}
          />
          <ServiceContractCard
            loading={contractLoading}
            roomId={roomId}
            contract={contract}
            accommodationId={room.accommodationId}
            navigation={navigation}
            reloadFlag={reloadContractFlag}
          />
        </SectionComponent>
      </ScrollView>
    </View>
  );
};

export default DetailRoomScreen;
