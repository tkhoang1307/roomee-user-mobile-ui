import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {globalStyles} from '@styles';
import RequestCard from './RequestCard';
import {appColors} from '@const/appColors';
import {useRequests} from '@hk/request/useRequests';
import TextComponent from '@components/TextComponent';
import CardTitleWithSharp from '@components/CardTitleWithSharp';
import {RootStackParamList} from '@models/navigators/HomNavigator';

interface RequestsCarousel {
  roomName: string;
  roomId: string;
  accomId: string;
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'DetailRoomScreen',
    undefined
  >;
}

const RequestsCarousel: React.FC<RequestsCarousel> = ({
  roomId,
  accomId,
  roomName,
  navigation,
}) => {
  const {t} = useTranslation();
  const {loading, requests} = useRequests({roomId, accommodationId: accomId});

  const requestsDisplay = [...requests, {id: 'dummy'} as any];

  const onViewMorePress = () => {
    navigation.navigate('RoomRequestsScreen', {
      roomId,
      roomName,
      accomId,
    });
  };

  return (
    <View style={[globalStyles.cardInfo, {paddingBottom: 4}]}>
      <CardTitleWithSharp title={t('request.pluralLabel')}>
        <TouchableOpacity
          style={{marginRight: 4}}
          onPress={() => onViewMorePress()}>
          <TextComponent>{t('actions.viewMore')}</TextComponent>
        </TouchableOpacity>
      </CardTitleWithSharp>

      <View style={{padding: 8, rowGap: 8}}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            minHeight: 140,
          }}>
          {loading ? (
            <ActivityIndicator size={30} color={appColors.primary} />
          ) : requests.length > 0 ? (
            <Carousel
              width={Dimensions.get('screen').width}
              height={160}
              mode="parallax"
              modeConfig={{
                parallaxScrollingScale: 0.9,
                parallaxScrollingOffset: 50,
              }}
              data={requestsDisplay}
              scrollAnimationDuration={1000}
              loop={false}
              renderItem={({index}) => (
                <View style={{flex: 1, justifyContent: 'center'}}>
                  {index < requestsDisplay.length - 1 ? (
                    <RequestCard
                      request={requestsDisplay[index]}
                      navigation={navigation}
                    />
                  ) : (
                    <TouchableOpacity onPress={() => onViewMorePress()}>
                      <View
                        style={[
                          globalStyles.borderInfoStyle,
                          {
                            backgroundColor: appColors.white,
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 1},
                            shadowOpacity: 0.8,
                            shadowRadius: 2,
                            elevation: 3,
                            height: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                          },
                        ]}>
                        <TextComponent>{t('actions.viewMore')}</TextComponent>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            />
          ) : (
            <TextComponent>{t('request.empty')}</TextComponent>
          )}
        </View>
      </View>
    </View>
  );
};

export default RequestsCarousel;
