import {View, TouchableOpacity, Image, FlatList, Text} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {IconOutline} from '@ant-design/icons-react-native';
import {GlobalConfigContext} from '@context';
import {globalStyles} from '@styles';

const languages = [
  {label: require('../../../../assets/images/vietnam_flag.png'), value: 'vi'},
  {label: require('../../../../assets/images/usa_flag.png'), value: 'en'},
];
const DropdownLaguageComponent = () => {
  const {languageMode} = useContext(GlobalConfigContext);
  const [clicked, setClicked] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(
    require('../../../../assets/images/vietnam_flag.png'),
  );
  useEffect(() => {
    languageMode.locale === 'vi'
      ? setSelectedLanguage(
          require('../../../../assets/images/vietnam_flag.png'),
        )
      : setSelectedLanguage(require('../../../../assets/images/usa_flag.png'));
  }, []);

  return (
    <View
      style={{flex: 1, position: 'absolute', top: 20, right: 10, zIndex: 999}}>
      <TouchableOpacity
        style={globalStyles.TochableLanguageDefault}
        onPress={() => {
          setClicked(!clicked);
        }}>
        <Image
          source={selectedLanguage}
          style={globalStyles.ImageLanguage}></Image>
        {clicked ? <IconOutline name="up" /> : <IconOutline name="down" />}
      </TouchableOpacity>
      {clicked ? (
        <View style={globalStyles.ViewSelectLanguage}>
          <FlatList
            data={languages}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={globalStyles.TochableLanguageSelect}
                  onPress={() => {
                    setSelectedLanguage(item.label);
                    setClicked(!clicked);
                    languageMode.changeLanguageMode(item.value);
                  }}>
                  <Image
                    source={item.label}
                    style={globalStyles.ImageLanguage}
                  />
                  <Text>{item.value.toUpperCase()}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      ) : null}
    </View>
  );
};

export default DropdownLaguageComponent;
