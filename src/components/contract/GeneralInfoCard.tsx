import {View, ActivityIndicator} from 'react-native';
import React from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {appColors} from '@const/appColors';
import {AccomRoomModel} from '@models/accommodation';
import {RootStackParamList} from '@models/navigators/HomNavigator';
import {globalStyles} from '@styles';
import CardTitleWithSharp from '@components/CardTitleWithSharp';
import {TextComponent} from '@components/index';
import {formatPrice} from '@utils/stringHelpers';

interface GeneralInfoCardProps {
  loading: boolean;
  room?: AccomRoomModel;
  // setReloadContractFlag: React.Dispatch<React.SetStateAction<boolean>>;
  navigation?: NativeStackNavigationProp<
    RootStackParamList,
    'DetailRoomScreen',
    undefined
  >;
}

const GeneralInfoCard: React.FC<GeneralInfoCardProps> = ({loading, room}) => {
  const {t} = useTranslation();

  return (
    <View style={globalStyles.cardInfo}>
      <CardTitleWithSharp title={t('label.generalInformation')} />

      <View style={{paddingHorizontal: 8, paddingVertical: 8, rowGap: 8}}>
        <View
          style={{
            minHeight: 100,
            justifyContent: 'center',
            rowGap: 8,
          }}>
          {loading ? (
            <ActivityIndicator size={30} color={appColors.primary} />
          ) : (
            <View style={{paddingLeft: 10, gap: 5}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name="door-open" size={25} />
                <TextComponent
                  text={`${t('room.roomname')}: ${room?.name}`}
                  styles={{marginLeft: 4}}
                />
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name="office-building" size={25} />
                <TextComponent
                  text={`${t('room.floor')}: ${room?.floor}`}
                  styles={{marginLeft: 4}}
                />
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name="account-group-outline" size={25} />
                <TextComponent
                  text={`${t('room.maxRenters')}: ${room?.maxRenters || ''}`}
                  styles={{marginLeft: 4}}
                />
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name="cash-multiple" size={25} />
                <TextComponent
                  text={`${t('room.rentcost')}: ${formatPrice(
                    room?.rentCost || 0,
                  )}  ₫`}
                  styles={{marginLeft: 4}}
                />
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name="aspect-ratio" size={25} />
                <TextComponent
                  text={`${t('room.area')}: ${room?.area} m²`}
                  styles={{marginLeft: 4}}
                />
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default GeneralInfoCard;
