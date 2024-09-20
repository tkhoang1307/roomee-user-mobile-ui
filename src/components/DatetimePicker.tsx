import {View} from 'react-native';
import React, {useContext, useState} from 'react';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {IconOutline} from '@ant-design/icons-react-native';

import {RowComponent, TextComponent} from '.';
// import {DateTime} from '../utils/DateTime';
import {globalStyles} from '@styles';
import {appColors} from '@const/appColors';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useTranslation} from 'react-i18next';
import {GlobalConfigContext} from '@context';
// import {DateTime} from '@utils/datetimePicker';

interface Props {
  selected?: Date;
  type: 'date' | 'time';
  onSelect: (val: Date) => void;
  label?: string;
  require?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

const DateTimePicker = (props: Props) => {
  const {t} = useTranslation();
  const {languageMode} = useContext(GlobalConfigContext);
  const {type, onSelect, selected, label, require, minDate, maxDate} = props;
  const [isShowDatePicker, setIsShowDatePicker] = useState(false);

  return (
    <>
      <View style={{flex: 1}}>
        <View style={{display: 'flex', flexDirection: 'row'}}>
          {require && (
            <Icon
              name="asterisk"
              size={8}
              color={appColors.danger}
              style={{paddingTop: 3, marginRight: 4}}
            />
          )}
          {label && <TextComponent text={label} styles={{marginBottom: 8}} />}
        </View>
        <RowComponent
          styles={[globalStyles.inputContainer]}
          onPress={() => setIsShowDatePicker(true)}>
          <TextComponent
            text={` ${
              selected
                ? type === 'time'
                  ? moment(selected).format('hh:mm')
                  : moment(selected, 'DD/MM/YYYY').format('DD MMM YYYY')
                : t('actions.selectDate')
            }`}
            flex={1}
            styles={{textAlign: 'center'}}
          />
          {type === 'time' ? (
            <IconOutline name="clock-circle" size={22} color={appColors.gray} />
          ) : (
            <IconOutline name="calendar" size={22} color={appColors.gray} />
          )}
        </RowComponent>
        <DatePicker
          mode={type}
          open={isShowDatePicker}
          date={selected ? selected : new Date()}
          cancelText={t('actions.cancel')}
          confirmText={t('actions.confirm')}
          title={t('actions.selectDate')}
          modal
          onCancel={() => setIsShowDatePicker(false)}
          onConfirm={val => {
            setIsShowDatePicker(false);
            onSelect(val);
          }}
          locale={languageMode.locale === 'vi' ? 'vi' : 'en'}
          minimumDate={minDate ? minDate : undefined}
          maximumDate={maxDate ? maxDate : undefined}
        />
      </View>
    </>
  );
};

export default DateTimePicker;
