import moment from 'moment';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {globalStyles} from '@styles';
import {DATE_FORMAT} from '@const/format';
import {appColors} from '@const/appColors';
import InfoTypo from '@components/InforTypo';
import ContractStatusTag from './ContractStatusTag';
import {ContractTableModel} from '@models/contract';
import TextComponent from '@components/TextComponent';
import {useDetailAccommodation} from '@hk/useAccommodation';
import {RootStackParamList} from '@models/navigators/HomNavigator';

interface ContractCardProps {
  contract: ContractTableModel;
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'AccomContractsScreen',
    undefined
  >;
}

const ContractCard: React.FC<ContractCardProps> = ({contract, navigation}) => {
  const {t} = useTranslation();
  const {accommodation} = useDetailAccommodation(contract.room.accommodationId);
  const onPressCard = () => {
    navigation.navigate('DetailContractScreen', {
      contractId: contract.id,
      roomId: contract.roomId,
      roomName: contract.room.name,
      accomId: contract.room.accommodationId,
      accomName: accommodation.name || '',
    });
  };

  return (
    <TouchableOpacity onPress={onPressCard}>
      <View
        style={[
          globalStyles.borderInfoStyle,
          {
            padding: 8,
            rowGap: 4,
            backgroundColor: appColors.white,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.8,
            shadowRadius: 2,
            elevation: 3,
          },
        ]}>
        {/* requester */}
        <View style={{flexDirection: 'row', columnGap: 12, flexWrap: 'nowrap'}}>
          <Icon name="file-sign" color={appColors.black} size={20} />
          <TextComponent>{`${t('room.contract')} ${t(
            'label.room',
          ).toLowerCase()}: ${contract.room.name}`}</TextComponent>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          {/* icon and type */}
          <View
            style={{flexDirection: 'row', alignItems: 'center', columnGap: 12}}>
            <InfoTypo
              containerStyle={{
                alignSelf: 'stretch',
              }}
              contentStyle={{textAlign: 'center'}}
              title={t('label.contractPeriod')}>
              {`${moment(contract.startDate).format(DATE_FORMAT)} - ${moment(
                contract.endDate,
              ).format(DATE_FORMAT)}`}
            </InfoTypo>
          </View>
          {/* status */}
          <ContractStatusTag status={contract.state} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ContractCard;
