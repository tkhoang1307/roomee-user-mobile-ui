import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {IconOutline} from '@ant-design/icons-react-native';

import {appColors} from '@const/appColors';
import {fontFamilies} from '@const/fontFamilies';
import {TextComponent} from '@components/index';

type OptionFloor = {
  value: string;
  label: string;
};

interface Props {
  title?: string;
  data: OptionFloor[];
  setValue?: React.Dispatch<React.SetStateAction<string>>;
  setId?: React.Dispatch<React.SetStateAction<string>>;
  value?: string;
  errorMessage?: string;
  // onChange?: (val: string) => void;
  placeholder?: string;
}

const FloorOptionsComponent: React.FC<Props> = ({
  data,
  title,
  setValue,
  // setId,
  value,
  errorMessage,
  placeholder,
  // onChange,
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const getLabelFromValue: (value: string) => string | null = value => {
    const item = data.find(item => item.value === value);
    return item ? item.label : null;
  };
  return (
    <View>
      <View style={{flexDirection: 'row'}}>
        <Text
          style={{
            fontSize: 14,
            color: appColors.text,
            fontFamily: fontFamilies.regular,
          }}>
          {title + ':'}
        </Text>

        <Icon
          name="asterisk"
          size={8}
          color={appColors.danger}
          style={{paddingTop: 3}}
        />
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
            {value === '' ? (
              <TextComponent
                text={!placeholder ? 'Chọn tầng' : placeholder}
                // color={appColors.gray}
                styles={{fontFamily: fontFamilies.semiBold}}
              />
            ) : (
              <TextComponent
                text={getLabelFromValue(value || '') || ''}
                styles={{fontFamily: fontFamilies.semiBold}}
              />
            )}
          </View>
          <IconOutline name="down" />
        </View>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={openModal}
        style={{width: Dimensions.get('window').width * 0.7}}>
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
                  size={18}
                  style={{marginBottom: 0, marginRight: 10}}
                />
                <TextComponent
                  text={title || ''}
                  size={16}
                  styles={{paddingBottom: 3}}
                />
              </View>
              <View
                style={{
                  borderBottomColor: appColors.gray,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                }}
              />
            </View>

            <View style={{maxHeight: 500, width: '100%'}}>
              <FlatList
                data={data}
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
                        // setId && setId(item.value);
                        // onChange && onChange();
                        setOpenModal(!openModal);
                      }}
                      key={index}>
                      <TextComponent
                        text={item.label}
                        styles={{fontFamily: fontFamilies.bold}}
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
              <Text style={styles.textStyle}>Đóng</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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

export default FloorOptionsComponent;

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
    //  marginHorizontal: 50,
    //  marginLeft: 50,
    //  marginRight: 50,
  },
  button: {
    borderRadius: 12,
    padding: 10,
    elevation: 2,
    marginTop: 20,
  },
  buttonClose: {
    backgroundColor: appColors.primary,
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
