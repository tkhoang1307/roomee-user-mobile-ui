import {View} from 'react-native';
import React, {useEffect, useState} from 'react';

import {appColors} from '@const/appColors';
import TextComponent from './TextComponent';

interface Props {
  current: number;
  width?: number;
  index: number;
  title: string;
}

type StepState = 'active' | 'passed' | 'none';

const ItemStepComponent = ({index, current, width, title}: Props) => {
  const [state, setState] = useState<StepState>('none');

  useEffect(() => {
    if (current === index) {
      setState('active');
    }
    if (current > index) {
      setState('passed');
    }
    if (current < index) {
      setState('none');
    }
  }, [current]);

  return (
    <View style={{width: width}}>
      <TextComponent
        size={14}
        text={title}
        styles={{
          color:
            state === 'none'
              ? appColors.gray
              : state === 'active'
              ? appColors.primary
              : appColors.text,
          textAlign: 'center',
        }}
      />
      <View
        style={{
          height: 2,
          width: '100%',
          backgroundColor:
            state === 'none'
              ? appColors.gray
              : state === 'active'
              ? appColors.primary
              : appColors.primary,
        }}></View>
    </View>
  );
};

export default ItemStepComponent;
