import TitleComponent from '@components/TitleComponent';
import ContractInfoCard from '@components/contract/ContractInfoCard';
import TenantsInfoCard from '@components/tenant/TenantsInfoCard';
import {AbilityActionEnum, AbilitySubjectEnum} from '@const/abilities';
import {AbilityContext} from '@context';
import {AccomRoomModel} from '@models/accommodation';
import {ContractModel} from '@models/contract';
import {DetailContractScreenProps} from '@models/navigators/HomNavigator';
import {contractService} from '@services';
import {globalStyles} from '@styles';
import {useContext, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, View} from 'react-native';

const DetailContractScreen: React.FC<DetailContractScreenProps> = ({
  route,
  navigation,
}) => {
  const {t} = useTranslation();
  const ability = useContext(AbilityContext);
  const contractId = route.params.contractId;
  const room: AccomRoomModel = useMemo(
    () => ({
      id: route.params.roomId,
      name: route.params.roomName,
      accommodationId: route.params.accomId,
      area: 0,
      rentCost: 0,
      floor: 0,
      _count: {
        contractTenants: 0,
      },
      tenants: 0,
    }),
    [route],
  );
  const [contractLoading, setContractLoading] = useState(true);
  const [contract, setContract] = useState<ContractModel>();
  const [reloadContractFlag, setReloadContractFlag] = useState(false);

  useEffect(() => {
    const getContract = async () => {
      if (!contractId) return;
      try {
        setContractLoading(true);
        const contractRes = await contractService.getContractById(
          contractId || '',
        );
        setContract(contractRes);
      } catch (error: any) {
        // toast.error(error?.response?.data.message);
      } finally {
        setContractLoading(false);
      }
    };
    getContract();
  }, [contractId, reloadContractFlag]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // do something
      setReloadContractFlag(pre => !pre);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={globalStyles.container}>
      <TitleComponent
        back
        title={t('label.contractTitle', {
          roomName: route.params.roomName,
          accomName: route.params.accomName,
        })}
        titleStyle={{fontSize: 16, marginTop: -2}}
      />

      <ScrollView style={{rowGap: 8, marginVertical: 8, paddingHorizontal: 8}}>
        <View style={{marginBottom: 8}}>
          <ContractInfoCard
            loading={contractLoading}
            contract={contract}
            editable={ability.can(
              AbilityActionEnum.EDIT,
              AbilitySubjectEnum.CONTRACT,
            )}
            currentContract
            setReloadContractFlag={setReloadContractFlag}
            setContract={setContract}
            navigation={navigation}
          />
        </View>
        <TenantsInfoCard
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
      </ScrollView>
    </View>
  );
};

export default DetailContractScreen;
