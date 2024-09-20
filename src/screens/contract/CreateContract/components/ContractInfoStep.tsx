// import Pdf from 'react-native-pdf';
import {useTranslation} from 'react-i18next';
import {Button, View} from '@ant-design/react-native';
import {
  Control,
  Controller,
  FieldErrors,
  UseFormSetValue,
} from 'react-hook-form';
import {ScrollView, StyleSheet, Text} from 'react-native';
// import {Portal} from 'react-native-portalize';
// import {Modalize} from 'react-native-modalize';
import {useEffect, useState} from 'react';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/FontAwesome';

import Divider from './Divider';
import {appColors} from '@const/appColors';
import TextComponent from '@components/TextComponent';
import {CreateContractControl} from '@models/contract';
import DateTimePicker from '@components/DatetimePicker';
import InputComponent from '@components/InputComponent';
import {ContractTemplateModel} from '@models/accommodation';
import {ServiceAccommodationResponseModel} from '@models/service-utility';
import PdfPopup from '@components/PdfPopup';

interface ContractInfoStep {
  control: Control<CreateContractControl, any>;
  errors: FieldErrors<{
    startDate: Date;
    endDate: Date;
    deposit: string;
    rentalCost: string;
    water: string;
    electric: string;
    template: string;
  }>;
  waterService?: ServiceAccommodationResponseModel | null;
  electricService?: ServiceAccommodationResponseModel | null;
  templateUrl: string;
  setTemplateUrl: React.Dispatch<React.SetStateAction<string>>;
  templates: ContractTemplateModel[];
  setValue: UseFormSetValue<CreateContractControl>;
}

const ContractInfoStep: React.FC<ContractInfoStep> = ({
  control,
  errors,
  waterService,
  electricService,
  templateUrl,
  setTemplateUrl,
  templates,
  setValue,
}) => {
  const {t} = useTranslation();
  const today = new Date();
  const [templateOpts, setTemplateOpts] = useState<
    {label: string; value: string}[]
  >([]);
  // const modalizeRef = useRef<Modalize>();
  const [openPdf, setOpenPdf] = useState(false);

  useEffect(() => {
    if (templates)
      setTemplateOpts(
        templates.map(t => {
          return {
            label: t.name,
            value: t.id,
          };
        }),
      );
  }, [templates]);

  const handlePeriodTemplate = (p: number) => {
    let currentDate = new Date();

    setValue('startDate', currentDate);

    currentDate.setMonth(currentDate.getMonth() + p);

    setValue('endDate', currentDate);
  };

  return (
    <ScrollView>
      {/* divider */}
      <Divider />
      <View style={{rowGap: 8, paddingBottom: 8}}>
        <TextComponent>{t('label.period') + ':'}</TextComponent>
        <View style={{flexDirection: 'row', columnGap: 8, flexWrap: 'wrap'}}>
          <Button
            onPress={() => handlePeriodTemplate(2)}
            style={{height: 40}}
            styles={{largeRawText: {fontSize: 14}}}>
            {`${2} ${t('label.month')}`}
          </Button>
          <Button
            onPress={() => handlePeriodTemplate(3)}
            style={{height: 40}}
            styles={{largeRawText: {fontSize: 14}}}>
            {`${3} ${t('label.month')}`}
          </Button>
          <Button
            onPress={() => handlePeriodTemplate(6)}
            style={{height: 40}}
            styles={{largeRawText: {fontSize: 14}}}>
            {`${6} ${t('label.month')}`}
          </Button>
          <Button
            onPress={() => handlePeriodTemplate(12)}
            style={{height: 40}}
            styles={{largeRawText: {fontSize: 14}}}>
            {`${1} ${t('label.year')}`}
          </Button>
        </View>
      </View>
      <Controller
        name="startDate"
        control={control}
        rules={{
          required: true,
        }}
        render={({field: {value, onChange}}) => (
          <DateTimePicker
            label={t('label.startDate') + ':'}
            type="date"
            onSelect={val => onChange(new Date(val))}
            selected={value}
            require
            minDate={new Date()}
          />
        )}
      />
      <Controller
        name="endDate"
        control={control}
        rules={{
          required: true,
        }}
        render={({field: {value, onChange}}) => (
          <DateTimePicker
            label={t('label.endDate') + ':'}
            type="date"
            onSelect={val => onChange(new Date(val))}
            selected={value}
            require
            minDate={new Date(today.getTime() + 24 * 60 * 60 * 1000)}
          />
        )}
      />
      <Controller
        name="deposit"
        control={control}
        rules={{
          required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <InputComponent
            label={t('label.deposit')}
            value={value}
            onChange={val => {
              const numStr = parseFloat(val.replaceAll(',', '')) || '';
              onChange(
                numStr ? new Intl.NumberFormat('ja-JP').format(numStr) : '',
              );
            }}
            onBlur={onBlur}
            numeric
            require
            errorMessage={
              errors.deposit ? t('validation.costRequired') : undefined
            }
            suffix={<TextComponent size={18}>₫</TextComponent>}
          />
        )}
      />
      <Controller
        name="rentalCost"
        control={control}
        rules={{
          required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <InputComponent
            label={t('label.rentalCost')}
            value={value}
            onChange={val => {
              const numStr = parseFloat(val.replaceAll(',', '')) || '';
              onChange(
                numStr ? new Intl.NumberFormat('ja-JP').format(numStr) : '',
              );
            }}
            onBlur={onBlur}
            numeric
            require
            errorMessage={
              errors.rentalCost ? t('validation.costRequired') : undefined
            }
            suffix={
              <TextComponent size={18}>{`₫ / ${t(
                'service.rentalCost.unit.month',
              )}`}</TextComponent>
            }
          />
        )}
      />
      <Controller
        name="water"
        control={control}
        rules={{
          required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <InputComponent
            label={t('label.waterCost')}
            value={value}
            onChange={val => {
              const numStr = parseFloat(val.replaceAll(',', '')) || '';
              onChange(
                numStr ? new Intl.NumberFormat('ja-JP').format(numStr) : '',
              );
            }}
            onBlur={onBlur}
            numeric
            require
            errorMessage={
              errors.water ? t('validation.costRequired') : undefined
            }
            suffix={
              <TextComponent size={18}>
                {waterService
                  ? `₫ / ${t(
                      `service.${waterService.name}.unit.${waterService.unit}`,
                    )}`
                  : '₫'}
              </TextComponent>
            }
          />
        )}
      />
      <Controller
        name="electric"
        control={control}
        rules={{
          required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <InputComponent
            label={t('label.electricityCost')}
            value={value}
            onChange={val => {
              const numStr = parseFloat(val.replaceAll(',', '')) || '';
              onChange(
                numStr ? new Intl.NumberFormat('ja-JP').format(numStr) : '',
              );
            }}
            onBlur={onBlur}
            numeric
            require
            errorMessage={
              errors.electric ? t('validation.costRequired') : undefined
            }
            suffix={
              <TextComponent size={18}>
                {electricService
                  ? `₫ / ${t(
                      `service.${electricService.name}.unit.${electricService.unit}`,
                    )}`
                  : '₫'}
              </TextComponent>
            }
          />
        )}
      />
      <Controller
        name="template"
        control={control}
        rules={{
          required: true,
        }}
        render={({field: {onChange, value}}) => (
          <View>
            <View style={{flexDirection: 'row'}}>
              <Icon
                name="asterisk"
                size={8}
                color={appColors.danger}
                style={{paddingTop: 3, marginRight: 4}}
              />
              <TextComponent
                text={t('label.template') + ':'}
                styles={{marginBottom: -8}}
              />
            </View>
            <RNPickerSelect
              value={value}
              onValueChange={(v, i) => {
                onChange(v);
                setTemplateUrl(templates[i - 1]?.settings?.templateUrl || '');
              }}
              placeholder={{label: t('placeholders.contractTemplate')}}
              items={templateOpts}
              itemKey={1}
              style={{
                inputAndroid: {
                  ...pickerSelectStyles.inputAndroid,
                  borderColor: errors.template
                    ? appColors.danger
                    : appColors.gray2,
                },
                inputIOS: {
                  ...pickerSelectStyles.inputIOS,
                  borderColor: errors.template
                    ? appColors.danger
                    : appColors.gray2,
                },
              }}
              useNativeAndroidPickerStyle={false}
            />
            {errors.template && (
              <Text style={{color: appColors.danger}}>
                {t('validation.fieldRequired')}
              </Text>
            )}
          </View>
        )}
      />
      <Button
        style={{borderTopLeftRadius: 0, borderTopEndRadius: 0}}
        disabled={!templateUrl}
        onPress={() => setOpenPdf(true)}>
        {t('actions.preview')}
      </Button>
      {/* <Portal>
        <Modalize
          adjustToContentHeight
          ref={modalizeRef}
          handlePosition="inside">
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-start',
              alignItems: 'center',
              borderWidth: 0.5,
              borderColor: appColors.gray2,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
              paddingTop: 16,
            }}>
            <Pdf
              style={{
                flex: 1,
                width: Dimensions.get('window').width,
                height:
                  Dimensions.get('window').height > 700
                    ? 700
                    : Dimensions.get('window').width,
                borderRadius: 16,
              }}
              trustAllCerts={false}
              source={{
                cache: true,
                uri: templateUrl,
              }}
              spacing={4}
            />
          </View>
        </Modalize>
      </Portal> */}
      <PdfPopup url={templateUrl} open={openPdf} setOpen={setOpenPdf} />
    </ScrollView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: appColors.gray2,
    marginTop: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    marginTop: 16,
    borderColor: appColors.gray2,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default ContractInfoStep;
