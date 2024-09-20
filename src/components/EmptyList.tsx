import {View} from 'react-native';
import TextComponent from './TextComponent';

interface EmptyListProps {
  children?: React.ReactNode;
}

const EmptyList: React.FC<EmptyListProps> = ({children}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        height: '100%',
      }}>
      <TextComponent size={20} styles={{textAlign: 'center'}}>
        {children}
      </TextComponent>
    </View>
  );
};

export default EmptyList;
