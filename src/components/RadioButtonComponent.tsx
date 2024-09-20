import {appColors} from '@const/appColors';
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import TextComponent from './TextComponent';

interface RadioButtonProps {
  options: {value: string; label: string}[];
  onValueChange: (value: string) => void;
  initialValue?: string;
  errorMessage?: string;
  style?: StyleProp<ViewStyle>;
}

const RadioButtonComponent: React.FC<RadioButtonProps> = ({
  options,
  onValueChange,
  initialValue,
  errorMessage,
  style,
}) => {
  const [selectedValue, setSelectedValue] = useState(initialValue);

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
    onValueChange(value);
  };
  return (
    <>
      <View style={[styles.radioButtonView, style]}>
        {options.map(option => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.radioButton,
              selectedValue === option.value && styles.selectedRadio,
              errorMessage && errorMessage.length > 0
                ? styles.errorRadio
                : null,
            ]}
            onPress={() => handleValueChange(option.value)}>
            <TextComponent
              styles={[
                styles.normalText,
                selectedValue === option.value && styles.selectedText,
              ]}>
              {option.label}
            </TextComponent>
          </TouchableOpacity>
        ))}
      </View>
      <View>
        {errorMessage && errorMessage.length > 0 ? (
          <TextComponent styles={{color: appColors.danger}}>
            {errorMessage}
          </TextComponent>
        ) : (
          <Text></Text>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  radioButtonView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  radioButton: {
    borderWidth: 1,
    borderColor: appColors.gray3,
    width: '30%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderRadius: 4,
  },
  normalText: {
    color: appColors.text,
  },
  selectedText: {
    color: appColors.primary,
  },
  selectedRadio: {
    borderColor: appColors.primary,
  },
  errorRadio: {
    borderColor: appColors.danger,
  },
  innerCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: 'blue',
  },
});

export default RadioButtonComponent;
