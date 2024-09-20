import {View, StyleSheet} from 'react-native';
import React, {useMemo} from 'react';
import {IconOutline} from '@ant-design/icons-react-native';
import {Popover} from '@ant-design/react-native';

import {appColors} from '@const/appColors';
import {fontFamilies} from '@const/fontFamilies';
import {RequestStatus} from '@models/request';
import RequestStatusTag from '@components/request/RequestStatusTag';

interface Props {
  setValue:
    | React.Dispatch<React.SetStateAction<RequestStatus>>
    | React.Dispatch<React.SetStateAction<RequestStatus | 'all'>>;
  value: string;
  type: 'select' | 'string';
  isEnd?: boolean;
  loading?: boolean;
  all?: boolean;
}

const Item = Popover.Item;

const StatusSelect = ({setValue, value, isEnd, all}: Props) => {
  const data = useMemo(() => {
    const statuses = Object.keys(RequestStatus);
    if (all) statuses.push('all');
    return statuses;
  }, []);

  let overlay = data.map(s => (
    <Item
      key={s}
      value={s}
      style={{padding: 0, backgroundColor: appColors.white, width: '100%'}}>
      <RequestStatusTag status={s as RequestStatus} />
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
        onSelect={value => setValue(value)}>
        <View
          style={[
            UnitCompStyle.unitContainer,
            {
              borderColor: appColors.gray2,
            },
          ]}>
          <View style={{flex: 1}}>
            <RequestStatusTag status={value as RequestStatus} />
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
    minWidth: 160,
  },
  textStringTypeStyle: {
    fontFamily: fontFamilies.bold,
    textAlign: 'center',
  },
});

export default StatusSelect;
