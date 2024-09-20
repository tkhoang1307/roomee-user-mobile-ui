import React, {useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {globalStyles} from '@styles';
import TenantCard from './TenantCard';
import {appColors} from '@const/appColors';
import {AbilityContext} from '@context';
import {ContractModel} from '@models/contract';
import {AccomRoomModel} from '@models/accommodation';
import TextComponent from '@components/TextComponent';
import CardTitleWithSharp from '@components/CardTitleWithSharp';
import {RootStackParamList} from '@models/navigators/HomNavigator';
import {AbilityActionEnum, AbilitySubjectEnum} from '@const/abilities';
import {ContractStateEnum} from '@const/contract';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TenantModel} from '@models/tenant';

interface TenantsInfoCardProps {
  loading: boolean;
  contract: ContractModel | undefined;
  room?: AccomRoomModel;
  editable?: boolean;
  currentContract?: boolean;
  setContract: React.Dispatch<React.SetStateAction<ContractModel | undefined>>;
  setReloadContractFlag: React.Dispatch<React.SetStateAction<boolean>>;
  navigation?: NativeStackNavigationProp<
    RootStackParamList,
    'DetailRoomScreen' | 'DetailContractScreen',
    undefined
  >;
  tenants: TenantModel[];
  setTenants: React.Dispatch<React.SetStateAction<TenantModel[]>>;
}

const TenantsInfoCard: React.FC<TenantsInfoCardProps> = ({
  loading,
  contract,
  currentContract,
  room,
  editable,
  setContract,
  navigation,
  tenants,
  setTenants,
}) => {
  const {t} = useTranslation();
  const ability = useContext(AbilityContext);

  return (
    <View style={globalStyles.cardInfo}>
      <CardTitleWithSharp title={t('label.tenantsInfo')}>
        {editable &&
          currentContract &&
          contract &&
          contract.state !== ContractStateEnum.TERMINATED &&
          contract.state !== ContractStateEnum.EXPIRED && (
            <View style={{flexDirection: 'row', columnGap: 8}}>
              <TouchableOpacity
                style={globalStyles.iconButton}
                onPress={() =>
                  navigation?.navigate('AddTenantScreen', {
                    roomId: room?.id || '',
                    roomName: room?.name || '',
                    contractId: contract.id,
                  })
                }>
                <Icon name="plus" size={30} />
              </TouchableOpacity>
            </View>
          )}
      </CardTitleWithSharp>

      {/* tenants information */}
      <View style={{paddingHorizontal: 8, paddingVertical: 8, rowGap: 8}}>
        <View
          style={{
            minHeight: 100,
            justifyContent: 'center',
            alignItems: loading ? 'center' : contract ? 'flex-start' : 'center',
            rowGap: 8,
          }}>
          {loading ? (
            <ActivityIndicator size={30} color={appColors.primary} />
          ) : contract ? (
            <>
              {tenants?.map(t => (
                <TenantCard
                  tenants={tenants}
                  setTenants={setTenants}
                  tenant={t}
                  editable={ability.can(
                    AbilityActionEnum.EDIT,
                    AbilitySubjectEnum.TENANT,
                  )}
                  contract={contract}
                  setContract={setContract}
                  key={t.id}
                  navigation={navigation}
                  roomId={room?.id || ''}
                />
              ))}
            </>
          ) : (
            <TextComponent>{t('label.emptyRoom')}</TextComponent>
          )}
        </View>
      </View>
    </View>
  );
};

export default TenantsInfoCard;
