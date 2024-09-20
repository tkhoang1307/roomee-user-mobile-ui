import {
  View,
  TouchableOpacity,
  StyleProp,
  TextStyle,
  Dimensions,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {IconOutline} from '@ant-design/icons-react-native';

import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
import {appColors} from '@const/appColors';

interface Props {
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
  back?: boolean;
  titleMiddle?: string;
  backgroundColor?: string;
}

const TitleComponent = (props: Props) => {
  const {title, titleStyle, back, titleMiddle} = props;

  const navigation: any = useNavigation();
  return (
    <>
      <View
        style={{
          backgroundColor: appColors.primary,
          zIndex: 999,
        }}>
        {(title || back) && (
          <RowComponent
            styles={{
              paddingHorizontal: 8,
              paddingVertical: 10,
              minWidth: 48,
              minHeight: 48,
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            {back && (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{marginRight: 12}}>
                <IconOutline
                  name="arrow-left"
                  size={28}
                  style={{zIndex: 1000, color: appColors.white}}
                />
              </TouchableOpacity>
            )}
            {title ? (
              <TextComponent
                text={title}
                styles={[
                  {
                    maxWidth:
                      Dimensions.get('screen').width - 12 - 28 - 16 - 10,
                    color: appColors.white,
                  },
                  titleStyle,
                  {fontSize: 20, marginTop: -2},
                ]}
              />
            ) : (
              <></>
            )}
          </RowComponent>
        )}
        {titleMiddle && (
          <RowComponent
            styles={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              minWidth: 48,
              minHeight: 48,
              justifyContent: 'center',
            }}>
            <TextComponent text={titleMiddle} styles={{textAlign: 'center'}} />
          </RowComponent>
        )}
      </View>
    </>
  );
};

export default TitleComponent;
