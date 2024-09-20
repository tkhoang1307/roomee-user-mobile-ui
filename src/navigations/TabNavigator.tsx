import {Platform, StatusBar} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {ReactNode, useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {appColors} from '@const/appColors';
import HomeNavigator from './HomeNavigator';
import {notificationService} from '@services';
import ProfileNavigator from './ProfileNavigator';
import ManagerNavigator from './ManagerNavigator';
import {AuthContext, NotiContext, UserContext} from '@context';
import NotificationNavigator from './NotificationNavigator';
import {requestToken, useMessageListener} from '@hk/useNotification';
import {NotificationActionEnum, NotificationType} from '@const/notification';
import {TabParamList} from '@models/navigators/TabNavigator';
import {fontFamilies} from '@const/fontFamilies';
import {useTranslation} from 'react-i18next';

const TabNavigator = () => {
  const Tab = createBottomTabNavigator<TabParamList>();
  const {userState} = useContext(UserContext);
  const {authState} = useContext(AuthContext);
  const {notiStore, notiDispatch} = useContext(NotiContext);
  const {t, i18n} = useTranslation();
  const [unread, setUnread] = useState<string | number>();

  useEffect(() => {
    if (notiStore.loading) return setUnread(undefined);
    const unreadEvents = notiStore.event.reduce((c, i) => {
      if (i.isRead) return c;
      return c + 1;
    }, 0);
    const unreadTopics = notiStore.topic.reduce((c, i) => {
      if (i.isRead) return c;
      return c + 1;
    }, 0);
    const unreadComments = notiStore.comment.reduce((c, i) => {
      if (i.isRead) return c;
      return c + 1;
    }, 0);
    const total = unreadComments + unreadTopics + unreadEvents;
    if (total === 0) return setUnread(undefined);
    if (total < 10) return setUnread(total);
    return setUnread('10+');
  }, [notiStore]);

  useEffect(() => {
    //setup receive notifications
    const notiSetup = async () => {
      //reset notifications
      notiDispatch({
        type: NotificationActionEnum.RESET_NOTI,
      });

      //get token and register for notification from server
      await requestToken();

      //fetch notis
      await Promise.all(
        Object.values(NotificationType).map(async type => {
          const notis = await notificationService.getNotifications(
            undefined,
            type,
          );
          notiDispatch({
            type: NotificationActionEnum.SET_NOTI,
            payload: {
              type: type,
              notis: notis,
            },
          });
        }),
      );

      notiDispatch({
        type: NotificationActionEnum.SET_LOADING,
        payload: {
          loading: false,
        },
      });
    };

    notiSetup();
  }, [authState, i18n.language]);

  useMessageListener();

  return (
    <>
      <StatusBar backgroundColor={appColors.primary} barStyle="dark-content" />
      <Tab.Navigator
        screenOptions={({route}) => {
          return {
            tabBarHideOnKeyboard: true,
            headerShown: false,
            tabBarStyle: {
              height: Platform.OS === 'android' ? 70 : 88,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: appColors.white,
            },
            tabBarIcon: ({focused, color, size}) => {
              let icon: ReactNode;
              color = focused ? appColors.primary : appColors.gray5;
              size = 28;
              switch (route.name) {
                case 'Home':
                  icon = <Icon name="home-outline" size={size} color={color} />;
                  break;
                case 'Profile':
                  icon = (
                    <Icon name="account-outline" size={size} color={color} />
                  );
                  break;
                case 'Manager':
                  icon = <Icon name="star-outline" size={size} color={color} />;
                  break;
                case 'Notification':
                  icon = <Icon name="bell-outline" size={size} color={color} />;
                  break;
              }
              return icon;
            },
            tabBarIconStyle: {
              marginTop: 8,
            },
          };
        }}>
        <Tab.Screen
          name="Home"
          component={HomeNavigator}
          options={{
            tabBarLabel: t('tabbar.home'),
            tabBarLabelStyle: {
              fontSize: 12,
              fontFamily: fontFamilies.medium,
              paddingBottom: 10,
            },
            tabBarActiveTintColor: appColors.primary,
          }}
        />
        {/* {userState.role === 'OWNER' && (
          <Tab.Screen
            name="Manager"
            component={ManagerNavigator}
            options={{
              tabBarLabel: t('tabbar.mainAccommodation'),
              tabBarLabelStyle: {
                fontSize: 12,
                fontFamily: fontFamilies.medium,
                paddingBottom: 10,
              },
              tabBarActiveTintColor: appColors.primary,
            }}
          />
        )} */}
        <Tab.Screen
          name="Notification"
          component={NotificationNavigator}
          options={{
            tabBarBadge: unread,
            tabBarLabel: t('tabbar.notification'),
            tabBarLabelStyle: {
              fontSize: 12,
              fontFamily: fontFamilies.medium,
              paddingBottom: 10,
            },
            tabBarActiveTintColor: appColors.primary,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileNavigator}
          options={{
            tabBarLabel: t('tabbar.profile'),
            tabBarLabelStyle: {
              fontSize: 12,
              fontFamily: fontFamilies.medium,
              paddingBottom: 10,
            },
            tabBarActiveTintColor: appColors.primary,
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default TabNavigator;
