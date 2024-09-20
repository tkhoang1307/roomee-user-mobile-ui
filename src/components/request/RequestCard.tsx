import {useTranslation} from 'react-i18next';
import {Image, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {globalStyles} from '@styles';
import useDateTime from '@hk/useDateTime';
import {appColors} from '@const/appColors';
import {fontFamilies} from '@const/fontFamilies';
import RequestStatusTag from './RequestStatusTag';
import TextComponent from '@components/TextComponent';
import {RequestModel, RequestType} from '@models/request';
import {MAX_REQUEST_DESCRIPTION_CHARS} from '@const/request';
import {RootStackParamList} from '@models/navigators/HomNavigator';

interface RequestCardProps {
  request: RequestModel;
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'RoomRequestsScreen' | 'DetailRoomScreen' | 'AccomRequestsScreen',
    undefined
  >;
  roomName?: string;
}

const RequestCard: React.FC<RequestCardProps> = ({
  request,
  navigation,
  roomName,
}) => {
  const {t} = useTranslation();
  const {timeFromNow} = useDateTime(request.createdAt);

  const onPressCard = () => {
    navigation.navigate('DetailRequestScreen', {
      topicId: request.id,
      request: request,
      roomName: roomName,
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
          <Image
            source={{uri: request.theme}}
            style={{width: 40, height: 40, borderRadius: 20}}
          />
          <View style={{flexGrow: 1}}>
            <TextComponent styles={{maxWidth: 200}}>
              {request.creator?.name}
            </TextComponent>
            <TextComponent color={appColors.gray}>{timeFromNow}</TextComponent>
          </View>
          {roomName && (
            <TextComponent>{`${t('label.room')}: ${roomName}`}</TextComponent>
          )}
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
            <View style={{width: 40, alignItems: 'center'}}>
              <Icon
                name={
                  request.type === RequestType.SERVICE
                    ? 'toolbox-outline'
                    : request.type === RequestType.ROOM_REPAIR
                    ? 'wrench-outline'
                    : 'face-agent'
                }
                color={appColors.black}
                size={20}
              />
            </View>
            <TextComponent font={fontFamilies.bold}>
              {t(`request.type.${request.type}`)}
            </TextComponent>
          </View>
          {/* status */}
          <RequestStatusTag status={request.status} />
        </View>
        <View style={{minHeight: 40, paddingHorizontal: 4}}>
          <TextComponent>
            {request.description.length > MAX_REQUEST_DESCRIPTION_CHARS
              ? request.description.substring(
                  0,
                  MAX_REQUEST_DESCRIPTION_CHARS,
                ) + ' ...'
              : request.description}
          </TextComponent>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RequestCard;
