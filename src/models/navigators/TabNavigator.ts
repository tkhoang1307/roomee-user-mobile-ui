import {NavigatorScreenParams} from '@react-navigation/native';

import {RootStackParamList} from './HomNavigator';
import {ProfileStackParamList} from './ProfileNavigator';
import {AddStackParamList} from './AddNavigator';
import {ManagerStackParamList} from './ManagerNavigator';
import {NotificationStackParamList} from './NotificationNavigator';

export type TabParamList = {
  Home: NavigatorScreenParams<RootStackParamList>;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
  Add: NavigatorScreenParams<AddStackParamList>;
  Manager: NavigatorScreenParams<ManagerStackParamList>;
  Notification: NavigatorScreenParams<NotificationStackParamList>;
};
