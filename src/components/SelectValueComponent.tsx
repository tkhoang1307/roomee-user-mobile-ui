import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useMemo, useState} from 'react';
import {IconOutline} from '@ant-design/icons-react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {appColors} from '@const/appColors';
import TextComponent from './TextComponent';
import {LocationOptionsModel} from '@models/location';
import {fontFamilies} from '@const/fontFamilies';
import {useTranslation} from 'react-i18next';
import InputComponent from './InputComponent';

interface Props {
  title?: string;
  data: LocationOptionsModel[];
  setValue?: React.Dispatch<React.SetStateAction<string>>;
  setId?: React.Dispatch<React.SetStateAction<string>>;
  value?: string;
  errorMessage?: string;
  require?: boolean;
  onChange?: () => void;
  loading?: boolean;
  wallet?: boolean;
}

const SelectValueComponent = ({
  title,
  data,
  setValue,
  value,
  errorMessage,
  require,
  loading,
  setId,
  onChange,
  wallet,
}: Props) => {
  const {t} = useTranslation();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [valueSearch, setValueSearch] = useState('');

  const filteredData = useMemo(() => {
    return data.filter(
      item =>
        item.label.toLowerCase().includes(valueSearch.toLowerCase()) ||
        item.value.toLowerCase().includes(valueSearch.toLowerCase()),
    );
  }, [data, valueSearch]);

  const getLabelFromValue: (value: string) => string | null = value => {
    const item = data.find(item => item.value === value);
    return item ? item.label : null;
  };

  return (
    <View>
      <View style={{flexDirection: 'row'}}>
        {require && (
          <Icon
            name="asterisk"
            size={8}
            color={appColors.danger}
            style={{paddingTop: 3, marginRight: 4}}
          />
        )}
        <Text
          style={{
            fontSize: 14,
            color: appColors.text,
            fontFamily: fontFamilies.regular,
          }}>
          {title + ':'}
        </Text>
      </View>

      <TouchableOpacity onPress={() => setOpenModal(true)}>
        <View
          style={[
            styles.selectContainer,
            {
              borderColor:
                errorMessage && errorMessage !== ''
                  ? appColors.danger
                  : appColors.gray2,
            },
          ]}>
          <View>
            {loading ? (
              <ActivityIndicator color={appColors.primary} />
            ) : value === '' ? (
              <TextComponent
                text={t('placeholders.chooseValue')}
                color={appColors.gray}
              />
            ) : (
              <TextComponent
                text={getLabelFromValue(value || '') || ''}
                styles={{fontFamily: fontFamilies.bold}}
              />
            )}
          </View>
          <IconOutline name="down" />
        </View>
        <Modal animationType="slide" transparent visible={openModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={{width: '100%'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    marginBottom: 10,
                  }}>
                  <IconOutline
                    name="bars"
                    size={22}
                    style={{marginBottom: 0, marginRight: 10}}
                  />
                  <TextComponent
                    text={title || ''}
                    size={18}
                    styles={{
                      paddingBottom: 3,
                      fontFamily: fontFamilies.semiBold,
                    }}
                  />
                </View>
              </View>

              {wallet && (
                <View>
                  <InputComponent
                    styleInput={{marginTop: 0}}
                    affix={<Icon name="search" />}
                    placeholder={t('placeholders.searchBank')}
                    value={valueSearch}
                    onChange={value => {
                      setValueSearch(value);
                    }}
                  />
                </View>
              )}

              <View style={{maxHeight: 500, width: '100%'}}>
                <FlatList
                  data={wallet ? filteredData : data}
                  renderItem={({item, index}) => {
                    return (
                      <TouchableOpacity
                        style={{
                          width: '100%',
                          alignSelf: 'center',
                          height: 50,
                          justifyContent: 'center',
                          borderBottomWidth: 0.5,
                          borderColor: '#8e8e8e',
                        }}
                        onPress={() => {
                          setValue && setValue(item.value);
                          setId && setId(item.value);
                          onChange && onChange();
                          setOpenModal(!openModal);
                        }}
                        key={index}>
                        <TextComponent
                          text={item.label}
                          styles={{
                            fontFamily: wallet
                              ? fontFamilies.medium
                              : fontFamilies.bold,
                          }}
                        />
                      </TouchableOpacity>
                    );
                  }}
                  keyExtractor={item => item.value}
                />
              </View>

              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setOpenModal(!openModal)}>
                <Text style={styles.textStyle}>{t('actions.close')}</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </TouchableOpacity>
      <View>
        {errorMessage && errorMessage.length > 0 ? (
          <Text style={{color: appColors.danger}}>{errorMessage}</Text>
        ) : (
          <Text></Text>
        )}
      </View>
    </View>
  );
};

export default SelectValueComponent;

const styles = StyleSheet.create({
  selectContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    // borderColor: appColors.gray2,
    width: '100%',
    minHeight: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: appColors.white,
    marginTop: 7,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 24,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
  },
  button: {
    borderRadius: 12,
    padding: 10,
    elevation: 2,
    marginTop: 20,
  },
  buttonClose: {
    width: '50%',
    height: 40,
    backgroundColor: appColors.primary,
    borderRadius: 8,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    //  marginBottom: 15,
    textAlign: 'center',
  },
});
