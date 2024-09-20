import {View} from 'react-native';
import React from 'react';

import {appColors} from '@const/appColors';
import StepComponent from './ItemStepComponent';

interface ItemProps {
  title?: string;
}

interface Props {
  current: number;
  items: ItemProps[];
}

const StepsComponent = ({current, items}: Props) => {
  //   console.log(current);
  const itemsStep = items.map((item, index) => (
    <StepComponent
      key={index}
      index={index}
      current={current}
      title={item.title || ''}
      width={items.length === 2 ? 170 : 110}
    />
  ));
  return (
    <View
      style={{
        backgroundColor: appColors.backgroundDefault,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      {itemsStep}
    </View>
  );
};

export default StepsComponent;
