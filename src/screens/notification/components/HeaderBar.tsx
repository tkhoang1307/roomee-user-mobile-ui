import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';

import {appColors} from '@const/appColors';
import {fontFamilies} from '@const/fontFamilies';
import {NotificationType} from '@const/notification';
import TextComponent from '@components/TextComponent';
import DividerComponent from '@components/DividerComponent';

interface HeaderBarProps {
  tab: NotificationType;
  setTab: React.Dispatch<React.SetStateAction<NotificationType>>;
}

const HeaderBar: React.FC<HeaderBarProps> = ({tab, setTab}) => {
  const {t} = useTranslation();

  return (
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}>
        <Tab tab={NotificationType.EVENT} setTab={setTab} curTab={tab} />
        <Tab tab={NotificationType.TOPIC} setTab={setTab} curTab={tab} />
        <Tab tab={NotificationType.COMMENT} setTab={setTab} curTab={tab} />
      </View>
    </View>
  );
};

interface TabProps extends HeaderBarProps {
  curTab: NotificationType;
}

const Tab: React.FC<TabProps> = ({tab, setTab, curTab}) => {
  const {t} = useTranslation();
  return (
    <TouchableOpacity onPressIn={() => setTab(tab)} style={{borderRadius: 4}}>
      <View
        style={{
          backgroundColor: appColors.white,
          borderBottomWidth: tab === curTab ? 2 : 0,
          paddingVertical: 12,
          minWidth: 90,
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 1,
          borderColor: appColors.primary,
        }}>
        <TextComponent>{t(`notifications.${tab}`)}</TextComponent>
      </View>
    </TouchableOpacity>
  );
};

export default HeaderBar;
