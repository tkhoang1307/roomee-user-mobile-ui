import {View, Text} from 'react-native';
import React, {useState} from 'react';
import {IconOutline} from '@ant-design/icons-react-native';
import {Popover} from '@ant-design/react-native';
import {useTranslation} from 'react-i18next';

import {appColors} from '@const/appColors';
import {UnitOptionModel} from '@models/location';
import {fontFamilies} from '@const/fontFamilies';
import {TextComponent} from '@components/index';
import {UnitCompStyle} from '../styles';

interface Props {
  initalValue?: string;
  data: UnitOptionModel[];
  setValue?: React.Dispatch<React.SetStateAction<string>>;
  setId?: React.Dispatch<React.SetStateAction<string>>;
  value?: string;
  errorMessage?: string;
  require?: boolean;
  type: 'select' | 'string';
  isEnd?: boolean;
}

const Item = Popover.Item;

const UnitComponent = ({
  initalValue,
  data,
  setValue,
  value,
  errorMessage,
  type,
  isEnd,
}: Props) => {
  const {t} = useTranslation();
  const [activeValue, setActiveValue] = useState(initalValue);
  const getLabelFromValue: (value: string) => string | null = value => {
    const item = data.find(item => item.value === value);
    return item ? item.label : null;
  };
  let disableOverlay;
  if (data?.length === 0) {
    disableOverlay = (
      <Item
        key="nullpopover"
        value="disabled"
        disabled
        style={UnitCompStyle.itemNullableStyle}>
        <Text style={{color: '#ddd'}}>
          {t('step.createAccommodation.unitNull')}
        </Text>
      </Item>
    );
  }

  let overlay = data.map((item, index) => (
    <Item key={index} value={item.value} style={{padding: 0}}>
      <TextComponent
        text={item.label}
        styles={[
          UnitCompStyle.itemTextStyle,
          {
            backgroundColor:
              item.value === activeValue
                ? appColors.backgroundLight
                : undefined,
          },
        ]}
      />
    </Item>
  ));
  return (
    <View style={{width: '100%'}}>
      {type === 'select' ? (
        <View>
          <Popover
            // triggerStyle={{padding:20}}
            overlay={data.length > 0 ? overlay : disableOverlay}
            placement={isEnd && isEnd ? 'top' : 'bottom'}
            onSelect={value => {
              setValue && setValue(value);
              setActiveValue && setActiveValue(value);
            }}>
            <View
              style={[
                UnitCompStyle.unitContainer,
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
                    text={
                      getLabelFromValue(initalValue || '') || initalValue || ''
                    }
                    styles={{fontFamily: fontFamilies.regular}}
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
          </Popover>
        </View>
      ) : (
        <View
          style={[
            UnitCompStyle.unitContainer,
            {
              borderColor:
                errorMessage && errorMessage !== ''
                  ? appColors.danger
                  : appColors.gray2,
              backgroundColor: '#ffffff0',
              borderWidth: 0,
            },
          ]}>
          <TextComponent
            text={data[0].label || ''}
            styles={[UnitCompStyle.textStringTypeStyle]}
          />
        </View>
      )}

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

export default UnitComponent;
