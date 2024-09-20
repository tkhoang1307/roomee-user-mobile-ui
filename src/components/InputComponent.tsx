import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardType,
  StyleProp,
  TextStyle,
} from 'react-native';
import React, {ReactNode, useState} from 'react';
import {IconOutline} from '@ant-design/icons-react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ViewStyle} from 'react-native';

import {appColors} from '../const/appColors';
import TextComponent from './TextComponent';
interface Props {
  value: string;
  onChange: (val: string) => void;
  onBlur?: any;
  onFocus?: any;
  affix?: ReactNode;
  placeholder?: string;
  suffix?: ReactNode;
  isPassword?: boolean;
  allowClear?: boolean;
  type?: KeyboardType;
  onEnd?: () => void;
  errorMessage?: string;
  label?: string;
  require?: boolean;
  styleInput?: StyleProp<ViewStyle>;
  numeric?: boolean;
  editable?: boolean;
  styleLabel?: StyleProp<TextStyle>;
}

const InputComponent = (props: Props) => {
  const {
    value,
    onChange,
    onBlur,
    onFocus,
    affix,
    suffix,
    placeholder,
    isPassword,
    allowClear,
    type,
    onEnd,
    errorMessage,
    label,
    require,
    styleInput,
    numeric,
    editable,
    styleLabel,
  } = props;

  const [isShowPass, setIsShowPass] = useState(isPassword ?? false);

  return (
    <>
      {label && (
        <View style={{flexDirection: 'row'}}>
          {require && (
            <Icon
              name="asterisk"
              size={8}
              color={appColors.danger}
              style={{paddingTop: 3, marginRight: 4}}
            />
          )}
          <TextComponent
            text={label + ':'}
            styles={[{marginBottom: -8}, styleLabel]}
          />
        </View>
      )}
      <View
        style={[
          styles.inputContainer,
          errorMessage && errorMessage.length > 0
            ? styles.inputContainerError
            : null,
          styleInput,
        ]}>
        {affix ?? affix}
        <TextInput
          style={[styles.input, {paddingHorizontal: affix ? 14 : 0}]}
          value={value}
          placeholder={placeholder ?? ''}
          onChangeText={val => onChange(val)}
          onBlur={onBlur}
          secureTextEntry={isShowPass}
          placeholderTextColor={'#747688'}
          keyboardType={type ?? 'default'}
          autoCapitalize="none"
          onEndEditing={onEnd}
          inputMode={numeric ? 'numeric' : undefined}
          editable={editable != undefined ? editable : true}
          onFocus={onFocus}
        />
        {suffix ?? suffix}
        <TouchableOpacity
          onPress={
            isPassword ? () => setIsShowPass(!isShowPass) : () => onChange('')
          }>
          {isPassword ? (
            <IconOutline
              name={isShowPass ? 'eye-invisible' : 'eye'}
              size={22}
              color={appColors.gray}
            />
          ) : (
            value?.length > 0 &&
            allowClear && (
              <IconOutline name="close" size={22} color={appColors.text} />
            )
          )}
        </TouchableOpacity>
      </View>
      <View>
        {errorMessage && errorMessage.length > 0 ? (
          <Text style={{color: appColors.danger}}>{errorMessage}</Text>
        ) : (
          <Text style={{zIndex: 5}}></Text>
        )}
      </View>
    </>
  );
};

export default InputComponent;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: appColors.gray2,
    width: '100%',
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: appColors.white,
    marginTop: 15,
  },
  inputContainerError: {
    borderColor: appColors.danger,
  },

  input: {
    padding: 0,
    margin: 0,
    flex: 1,
    // paddingHorizontal: 0,
    color: appColors.text,
  },
});
