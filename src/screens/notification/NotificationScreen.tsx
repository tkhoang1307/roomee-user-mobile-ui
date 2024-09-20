import {View} from 'react-native';

import {appColors} from '@const/appColors';
import {NotificationType} from '@const/notification';
import NotificationSession from './components/NotificationSession';
import {NotificationScreenProps} from '@models/navigators/NotificationNavigator';
import {Tabs} from '@ant-design/react-native';
import {useTranslation} from 'react-i18next';
import DividerComponent from '@components/DividerComponent';
import TextComponent from '@components/TextComponent';
import {fontFamilies} from '@const/fontFamilies';

const NotificationScreen = ({navigation}: NotificationScreenProps) => {
  const {t} = useTranslation();
  return (
    <View style={{backgroundColor: appColors.white, flex: 1}}>
      <View
        style={{
          flexDirection: 'column',
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          backgroundColor: appColors.white,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 0.8,
          shadowRadius: 2,
          elevation: 5,
          zIndex: 11,
        }}>
        <TextComponent
          font={fontFamilies.bold}
          styles={{
            textAlign: 'center',
            textAlignVertical: 'top',
            paddingVertical: 10,
            fontSize: 20,
            color: appColors.white,
            backgroundColor: appColors.secondary,
          }}
          title>
          {t('notifications.title')}
        </TextComponent>
        <DividerComponent width={'100%'} styles={{marginBottom: 1}} />
      </View>
      <Tabs
        initialPage={0}
        tabs={[
          {title: t('notifications.event')},
          {title: t('notifications.topic')},
          {title: t('notifications.comment')},
        ]}>
        <NotificationSession
          tab={NotificationType.EVENT}
          navigation={navigation}
        />
        <NotificationSession
          tab={NotificationType.TOPIC}
          navigation={navigation}
        />
        <NotificationSession
          tab={NotificationType.COMMENT}
          navigation={navigation}
        />
      </Tabs>
    </View>
  );
};

export default NotificationScreen;
