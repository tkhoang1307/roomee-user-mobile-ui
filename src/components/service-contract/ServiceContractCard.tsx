import {useEffect, useState} from 'react';
import {ActivityIndicator, Text, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {globalStyles} from '@styles';
import {Can} from '@context';
import {RootStackParamList} from '@models/navigators/HomNavigator';
import {AbilityActionEnum, AbilitySubjectEnum} from '@const/abilities';
import CardTitleWithSharp from '@components/CardTitleWithSharp';
import {ServiceRoomResponseModel} from '@models/service-utility';
import {serviceUtilityServices} from '@services';
import {MONEY_FORMAT_BY} from '@const/index';
import {styles} from './styles';
import TextComponent from '@components/TextComponent';
import {ServiceStateTag} from '..';
import {appColors} from '@const/appColors';
import {ContractModel} from '@models/contract';

interface ServiceContractCardProps {
  loading: boolean;
  roomId: string;
  accommodationId: string;
  navigation?: NativeStackNavigationProp<
    RootStackParamList,
    'DetailRoomScreen',
    undefined
  >;
  contract?: ContractModel;
  reloadFlag?: boolean;
}

const ServiceContractCard: React.FC<ServiceContractCardProps> = ({
  loading,
  roomId,
  accommodationId,
  navigation,
  contract,
  reloadFlag,
}) => {
  const {t} = useTranslation();
  const [roomServiceContracts, setRoomServiceContracts] = useState<
    Array<ServiceRoomResponseModel>
  >([]);

  useEffect(() => {
    const getAllServicesOfRoom = async () => {
      try {
        const resDataService =
          await serviceUtilityServices.getAllServicesForRoom(
            roomId || '',
            'ALL',
          );
        setRoomServiceContracts(resDataService);
      } catch (error) {
        // Alert.alert(t(`alertTitle.noti`), (error as ErrorResponseAxios).response.data.message);
      }
    };

    getAllServicesOfRoom();
  }, [roomId, reloadFlag]);

  useEffect(() => {
    const isPrimaryService = (serviceName: string) => {
      if (
        serviceName === 'rentalCost' ||
        serviceName === 'electric' ||
        serviceName === 'water'
      ) {
        return true;
      } else {
        return false;
      }
    };
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

  const renderItem = ({item}: {item: ServiceRoomResponseModel}) => (
    <View style={[styles.itemContainer]}>
      <View style={styles.subItemContainer}>
        <View style={styles.leftContainer}>
          <Text style={styles.itemText}>{t(`service.${item.name}.name`)}</Text>
          <Text style={styles.itemTitle}>
            {item.cost.toString().replace(MONEY_FORMAT_BY, ',')} /{' '}
            {t(`service.${item.name}.unit.${item.unit}`)}
          </Text>
        </View>
        <View style={styles.centerContainer}>
          <ServiceStateTag deleted={item.deleted} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={globalStyles.cardInfo}>
      <CardTitleWithSharp title={t('subItem.roomContractService')}>
        {contract && (
          <Can I={AbilityActionEnum.CREATE} a={AbilitySubjectEnum.TENANT}>
            <TouchableOpacity
              style={{marginRight: 4}}
              onPress={() =>
                navigation?.navigate('ServiceContractScreen', {
                  accommodationId: accommodationId,
                  roomId: roomId,
                })
              }>
              <TextComponent>{t('actions.viewMore')}</TextComponent>
            </TouchableOpacity>
          </Can>
        )}
      </CardTitleWithSharp>

      <View style={{paddingHorizontal: 8, paddingVertical: 8, rowGap: 8}}>
        {loading ? (
          <View
            style={{
              minHeight: 100,
              justifyContent: 'center',
              alignItems: 'center',
              rowGap: 8,
            }}>
            <ActivityIndicator size={30} color={appColors.primary} />
          </View>
        ) : roomServiceContracts.length > 0 ? (
          <>
            <SwipeListView
              data={roomServiceContracts}
              renderItem={renderItem}
              leftOpenValue={0}
              rightOpenValue={0}
              previewRowKey={'0'}
              previewOpenValue={-40}
              previewOpenDelay={3000}
              onRowDidOpen={onRowOpen}
              scrollEnabled={false}
            />
          </>
        ) : (
          <View
            style={{
              minHeight: 100,
              justifyContent: 'center',
              alignItems: 'center',
              rowGap: 8,
            }}>
            <TextComponent>{t('label.emptyRoom')}</TextComponent>
          </View>
        )}
      </View>
    </View>
  );
};

export default ServiceContractCard;
