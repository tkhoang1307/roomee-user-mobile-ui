import {View} from '@ant-design/react-native';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';

import TextComponent from './TextComponent';
import {appColors} from '@const/appColors';
import {fontFamilies} from '@const/fontFamilies';
import {useTranslation} from 'react-i18next';

interface InfoTypoProps {
  children: React.ReactNode;
  title?: string;
  colon?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<TextStyle>;
  titleStyle?: StyleProp<TextStyle>;
}

const InfoTypo: React.FC<InfoTypoProps> = ({
  title,
  colon,
  children,
  containerStyle,
  contentStyle,
  titleStyle,
}) => {
  const {t} = useTranslation();
  return (
    <View
      style={{...(containerStyle as any), padding: 8, rowGap: 4, columnGap: 4}}>
      {title && (
        <TextComponent styles={titleStyle}>
          {colon ? `${title}:` : title}
        </TextComponent>
      )}
      {children ? (
        <TextComponent
          styles={{fontFamily: fontFamilies.bold, ...(contentStyle as object)}}
          flex={1}>
          {children}
        </TextComponent>
      ) : (
        <TextComponent
          styles={{
            ...(contentStyle as object),
            color: appColors.gray,
          }}>
          {t('label.notEstablished')}
        </TextComponent>
      )}
    </View>
  );
};

export default InfoTypo;
