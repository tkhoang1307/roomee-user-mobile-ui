import {View, TouchableOpacity, Dimensions} from 'react-native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Modal} from '@ant-design/react-native';

import {appColors} from '@const/appColors';
import {
  ButtonComponent,
  DividerComponent,
  InputComponent,
  SpaceComponent,
  TextComponent,
} from '@components/index';
import {fontFamilies} from '@const/fontFamilies';
import {UnitOptionModel} from '@models/location';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ErrorsAccommodationServices} from '../AddAccommodationScreen';

interface Props {
  label: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  unit: UnitOptionModel[];
  defaultUnit?: string;
  setValueUnit?: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
  type: 'modal' | 'input';
  errorMessage?: string;
  setErrorMessages?: React.Dispatch<
    React.SetStateAction<ErrorsAccommodationServices>
  >;
  name: string;
}

const ServiceUnit: React.FC<Props> = ({
  label,
  unit,
  value,
  setValue,
  setValueUnit,
  defaultUnit,
  placeholder,
  type,
  errorMessage,
  setErrorMessages,
  name,
}) => {
  const {t} = useTranslation();

  const [openModal, setOpenModal] = useState(false);
  const [activeUnit, setActiveUnit] = useState(defaultUnit);
  const getLabelFromValue: (value: string) => string | null = value => {
    const item = unit.find(item => item.value === value);
    return item ? item.label : null;
  };

  return type === 'modal' ? (
    <>
      {label && (
        <View style={{flexDirection: 'row', marginBottom: 15}}>
          <Icon
            name="asterisk"
            size={8}
            color={appColors.danger}
            style={{paddingTop: 3, marginRight: 4}}
          />
          <TextComponent text={label + ':'} styles={{marginBottom: -8}} />
        </View>
      )}
      <View
        style={{
          backgroundColor: appColors.white,
          borderWidth: 1,
          borderColor: appColors.gray2,
          borderRadius: 10,
        }}>
        <TouchableOpacity
          style={{
            height: 50,
            borderRadius: 10,
          }}
          onPress={() => {
            setOpenModal(true);
          }}>
          <View
            style={{
              backgroundColor: appColors.white,
              height: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 15,
              borderRadius: 10,
            }}>
            <TextComponent styles={{fontFamily: fontFamilies.semiBold}}>
              {value !== '' ? value : t('label.serviceCost')}
            </TextComponent>
            <View
              style={{
                backgroundColor: appColors.gray2,
                height: 30,
                width: 80,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 4,
              }}>
              <TextComponent styles={{fontFamily: fontFamilies.semiBold}}>
                {activeUnit !== ''
                  ? getLabelFromValue(activeUnit || '')
                  : t('label.unit')}
              </TextComponent>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View>
        {errorMessage && errorMessage.length > 0 ? (
          <TextComponent styles={{color: appColors.danger}}>
            {errorMessage}
          </TextComponent>
        ) : (
          <TextComponent styles={{zIndex: 5}}></TextComponent>
        )}
      </View>

      <Modal
        visible={openModal}
        animationType={'slide'}
        transparent={true}
        maskClosable
        style={{width: Dimensions.get('window').width * 0.8}}>
        <View>
          <View>
            <InputComponent
              styleLabel={{fontFamily: fontFamilies.semiBold}}
              label={label}
              value={value}
              onChange={value => {
                setValue(value);
                setErrorMessages &&
                  setErrorMessages(prevValues => ({
                    ...prevValues,
                    [name]: '',
                  }));
              }}
              placeholder={placeholder}
              numeric
            />
          </View>
          <DividerComponent width="100%" />
          <View>
            <TextComponent styles={{fontFamily: fontFamilies.semiBold}}>
              {t('label.unit')} :
            </TextComponent>
            <SpaceComponent height={10} />

            <View style={{backgroundColor: appColors.white}}>
              {unit.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setActiveUnit(item.value);
                    setValueUnit && setValueUnit(item.value);
                  }}
                  style={{
                    height: 50,
                    borderRadius: 10,
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: appColors.gray2,
                    backgroundColor:
                      activeUnit === item.value
                        ? appColors.backgroundLight
                        : appColors.white,
                    marginBottom: 20,
                  }}>
                  <TextComponent styles={{marginLeft: 15}}>
                    {item.label}
                  </TextComponent>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ButtonComponent
              type="primary"
              styles={{
                width: '100%',
              }}
              onPress={() => {
                setOpenModal(false);
              }}>
              {t('actions.submit')}
            </ButtonComponent>
          </View>
        </View>
      </Modal>
    </>
  ) : (
    <View>
      {label && (
        <View style={{flexDirection: 'row'}}>
          <Icon
            name="asterisk"
            size={8}
            color={appColors.danger}
            style={{paddingTop: 3, marginRight: 4}}
          />
          <TextComponent text={label + ':'} styles={{marginBottom: -8}} />
        </View>
      )}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 10,
        }}>
        <InputComponent
          placeholder={placeholder}
          value={value}
          onChange={value => {
            setValue(value);
            setErrorMessages &&
              setErrorMessages(prevValues => ({
                ...prevValues,
                [name]: '',
              }));
          }}
          type="numeric"
          suffix={
            <View
              style={{
                backgroundColor: appColors.gray2,
                height: 30,
                width: 80,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 4,
              }}>
              <TextComponent styles={{fontFamily: fontFamilies.semiBold}}>
                {defaultUnit !== ''
                  ? getLabelFromValue(defaultUnit || '')
                  : t('label.unit')}
              </TextComponent>
            </View>
          }
        />
      </View>
      <View>
        {errorMessage && errorMessage.length > 0 ? (
          <TextComponent styles={{color: appColors.danger}}>
            {errorMessage}
          </TextComponent>
        ) : (
          <TextComponent></TextComponent>
        )}
      </View>
    </View>
  );
};

export default ServiceUnit;
