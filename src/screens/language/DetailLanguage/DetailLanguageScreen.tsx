import {Image, TouchableOpacity, View} from 'react-native';
import React, {useContext, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';

import {globalStyles} from '@styles';
import {
  CircleComponent,
  ContainerComponent,
  LoadingScreenComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
  TitleComponent,
} from '@components/index';
import {appColors} from '@const/appColors';
import {GlobalConfigContext} from '@context';
import {Icon} from '@ant-design/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetailLanguageScreen = () => {
  const {t} = useTranslation();
  const {languageMode} = useContext(GlobalConfigContext);
  const [loading, setLoading] = useState<boolean>(false);

  const options = [
    {
      label: t('label.vietnam'),
      value: 'vi',
      imageSource: require('../../../assets/images/vietnam_flag.png'),
    },
    {
      label: t('label.english'),
      value: 'en',
      imageSource: require('../../../assets/images/usa_flag.png'),
    },
  ];

  const renderLanguageItem = useMemo(() => {
    return options.map(item => (
      <View
        key={item.value}
        style={{
          marginTop: 20,
          borderRadius: 4,
          backgroundColor: appColors.white,
          shadowColor: 'rgba(0,0,0,0.5)',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 6,
        }}>
        <TouchableOpacity
          onPress={() => {
            handleChangeLanguage(item.value);
          }}
          style={{
            width: '100%',
            height: 80,
            borderRadius: 8,
            paddingHorizontal: 16,
            paddingVertical: 6,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            flexDirection: 'row',
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 4,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                style={{
                  width: 50,
                  height: 50,
                  marginRight: 10,
                  borderRadius: 100,
                }}
                source={item.imageSource}
              />
              <View>
                <TextComponent>{item.label}</TextComponent>
              </View>
            </View>
            {item.value === languageMode.locale ? (
              <CircleComponent size={20} color={appColors.black}>
                <Icon name="check" size={12} color={appColors.white} />
              </CircleComponent>
            ) : (
              <View
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: 100,
                  borderColor: appColors.gray,
                  borderWidth: 1,
                }}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    ));
  }, [languageMode.locale]);

  const handleChangeLanguage = async (value: string) => {
    languageMode.changeLanguageMode(value);
    await AsyncStorage.setItem('locale', value);
  };

  return (
    <View style={[globalStyles.container, {position: 'relative'}]}>
      <TitleComponent
        back
        title={t('screensTitle.language')}
        titleStyle={{fontSize: 20, marginTop: -2}}
      />
      <SpaceComponent height={10} />
      {loading && <LoadingScreenComponent loading={loading} />}
      <SectionComponent styles={{flex: 1}}>
        <ContainerComponent isScroll>
          <View>{renderLanguageItem}</View>
        </ContainerComponent>
      </SectionComponent>
    </View>
  );
};

export default DetailLanguageScreen;
