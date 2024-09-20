import {ActivityIndicator, FlatList, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {appColors} from '@const/appColors';
import {contractService} from '@services';
import {useEffect, useMemo, useState} from 'react';
import {ContractStateEnum} from '@const/contract';
import StatusSelect from './components/StatusSelect';
import {ContractTableModel} from '@models/contract';
import TextComponent from '@components/TextComponent';
import TitleComponent from '@components/TitleComponent';
import ContractCard from '@components/contract/ContractCard';
import {AccomContractsScreenProps} from '@models/navigators/HomNavigator';

const AccomContractsScreen: React.FC<AccomContractsScreenProps> = ({
  navigation,
  route,
}) => {
  const {t} = useTranslation();
  const accommodationId = useMemo(() => route.params.accomId, [route]);
  const [status, setStatus] = useState<ContractStateEnum | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState<ContractTableModel[]>([]);
  const displayContracts: ContractTableModel[] = useMemo(() => {
    return contracts.filter(c => {
      if (status === 'all') return true;
      if (
        status === ContractStateEnum.PROCESSING &&
        ContractStateEnum.CREATED !== c.state &&
        ContractStateEnum.PROCESSING !== c.state
      )
        return false;
      if (status !== c.state) return false;
      return true;
    });
  }, [contracts, status]);

  const getContracts = async () => {
    if (!accommodationId) return;
    try {
      setLoading(true);
      const contractsRes = await contractService.getContracts({
        accommodationId: accommodationId,
      });

      const contractsTable: ContractTableModel[] = contractsRes.map(c => {
        return {
          ...c,
          key: c.id,
        };
      });
      setContracts(
        contractsTable.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        ),
      );
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getContracts();
  }, [accommodationId]);

  return (
    <View style={{rowGap: 4, flex: 1}}>
      <TitleComponent
        back
        backgroundColor={appColors.backgroundCard}
        title={`${t('label.listContract')}`}
        titleStyle={{fontSize: 20}}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginTop: 2,
          paddingHorizontal: 4,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 8,
          }}>
          <StatusSelect
            value={status}
            setValue={setStatus}
            type="select"
            loading={false}
            all
          />
        </View>
      </View>
      {loading && displayContracts.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            height: '100%',
          }}>
          <ActivityIndicator size={30} color={appColors.primary} />
        </View>
      ) : displayContracts.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TextComponent>{t('label.emptyContracts')}</TextComponent>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{flexGrow: 1, paddingHorizontal: 4, rowGap: 8}}
          data={displayContracts}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <ContractCard contract={item} navigation={navigation} />
          )}
          style={{marginBottom: 4}}
          refreshing={loading}
          onRefresh={() => getContracts()}
        />
      )}
    </View>
  );
};

export default AccomContractsScreen;
