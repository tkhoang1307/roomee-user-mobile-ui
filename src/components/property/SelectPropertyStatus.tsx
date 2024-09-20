import {View, StyleSheet, ViewStyle, StyleProp} from 'react-native';
import React, {useMemo} from 'react';
import {IconOutline} from '@ant-design/icons-react-native';
import {Popover} from '@ant-design/react-native';

import {appColors} from '@const/appColors';
import {fontFamilies} from '@const/fontFamilies';
import {PropertyStatus} from '@const/property';
import PropertyStatusTag from './PropertyStatusTag';

interface Props {
  setValue:
    | React.Dispatch<React.SetStateAction<PropertyStatus>>
    | React.Dispatch<React.SetStateAction<PropertyStatus | 'all'>>;
  value: string;
  type: 'select' | 'string';
  isEnd?: boolean;
  loading?: boolean;
  all?: boolean;
  onChange?: (value: string) => void;
  style?: StyleProp<ViewStyle>;
}

const Item = Popover.Item;

const SelectPropertyStatus = ({
  setValue,
  value,
  isEnd,
  all,
  onChange,
  style,
}: Props) => {
  const data = useMemo(() => {
    const statuses = Object.keys(PropertyStatus);
    if (all) statuses.push('all');
    return statuses;
  }, []);

  let overlay = data.map(s => (
    <Item
      key={s}
      value={s}
      style={{padding: 0, backgroundColor: appColors.white, width: '100%'}}>
      <PropertyStatusTag status={s as PropertyStatus} />
    </Item>
  ));
  return (
    <View>
      <Popover
        // disabled={loading}
        overlay={overlay}
        renderOverlayComponent={nodes => (
          <View style={{rowGap: 4, padding: 4, borderRadius: 12}}>{nodes}</View>
        )}
        placement={isEnd && isEnd ? 'top' : 'bottom'}
        onSelect={value => {
          setValue(value);
          onChange && onChange(value);
        }}>
        <View
          style={[
            UnitCompStyle.unitContainer,
            {
              borderColor: appColors.gray2,
            },
            style,
          ]}>
          <View style={{flex: 1}}>
            <PropertyStatusTag status={value as PropertyStatus} />
          </View>
          <IconOutline name="down" />
        </View>
      </Popover>
    </View>
  );
};

const UnitCompStyle = StyleSheet.create({
  itemNullableStyle: {
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTextStyle: {
    fontSize: 16,
    width: 120,
    textAlignVertical: 'center',
    paddingLeft: 10,
    height: 40,
  },
  unitContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 4,
    backgroundColor: appColors.white,
    columnGap: 4,
    minWidth: 200,
  },
  textStringTypeStyle: {
    fontFamily: fontFamilies.bold,
    textAlign: 'center',
  },
});

export default SelectPropertyStatus;
