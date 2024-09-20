import {View} from 'react-native';

import SharpSymbol from './SharpSymbol';
import TextComponent from './TextComponent';
import {appColors} from '@const/appColors';
import {fontFamilies} from '@const/fontFamilies';

interface CardTitleWithSharpProps {
  title: string;
  children?: React.ReactNode;
}

const CardTitleWithSharp: React.FC<CardTitleWithSharpProps> = ({
  title,
  children,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        columnGap: 8,
        alignItems: 'center',
        padding: 8,
        borderBottomWidth: 1,
        borderColor: appColors.gray2,
      }}>
      <SharpSymbol />
      <TextComponent
        styles={{fontFamily: fontFamilies.bold, fontSize: 16, flex: 1}}>
        {title}
      </TextComponent>

      {children}
    </View>
  );
};

export default CardTitleWithSharp;
