import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import TextComponent from '@components/TextComponent';
import {ComponentStyle} from '../styles';

interface Props {
  iconName: string;
  serviceName: string;
  onPress: () => void;
  iconSize?: number;
}

const BoxServiceComponent: React.FC<Props> = ({
  iconName,
  serviceName,
  onPress,
  iconSize,
}) => {
  return (
    <TouchableOpacity style={ComponentStyle.boxServiceStyles} onPress={onPress}>
      <Icon name={iconName ?? 'help-box'} size={iconSize ?? 35} />
      <View style={{paddingHorizontal: 5}}>
        <TextComponent text={serviceName} styles={{textAlign: 'center'}} />
      </View>
    </TouchableOpacity>
  );
};

export default BoxServiceComponent;
