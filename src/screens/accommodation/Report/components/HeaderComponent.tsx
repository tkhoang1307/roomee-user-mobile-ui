import {useTranslation} from 'react-i18next';
import {Dimensions, StyleSheet, View} from 'react-native';

import SharpSymbol from '@components/SharpSymbol';
import {
  SegmentedControl,
  SpaceComponent,
  TextComponent,
} from '@components/index';
import {appColors} from '@const/appColors';
import {OptionsQueryContractEnum} from '@const/contract';
import {fontFamilies} from '@const/fontFamilies';
interface ReportHeaderProps {
  option: number;
  setOption: React.Dispatch<React.SetStateAction<number>>;
  fetchReport: (option: number) => {};
  // style?: React.CSSProperties;
  title?: string;
}
const HeaderComponent: React.FC<ReportHeaderProps> = ({
  option,
  setOption,
  fetchReport,
  title,
}) => {
  const {t} = useTranslation();
  const options = [
    {
      value: OptionsQueryContractEnum.THIS_MONTH,
      label: t('report.options.THIS_MONTH'),
    },
    {
      value: OptionsQueryContractEnum.TWO_MONTHS,
      label: t('report.options.TWO_MONTHS'),
    },
    {
      value: OptionsQueryContractEnum.THREE_MONTHS,
      label: t('report.options.THREE_MONTHS'),
    },
    {
      value: OptionsQueryContractEnum.SIX_MONTHS,
      label: t('report.options.SIX_MONTHS'),
    },
    {
      value: OptionsQueryContractEnum.THIS_YEAR,
      label: t('report.options.THIS_YEAR'),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <SharpSymbol />
        <TextComponent
          text={title || 'Báo cáo'}
          styles={{
            fontFamily: fontFamilies.bold,
            fontSize: 16,
            marginLeft: 5,
            maxWidth: Dimensions.get('screen').width - 40 - 18,
          }}
        />
      </View>
      <SpaceComponent height={10} />
      <View style={{alignContent: 'flex-end', flexShrink: 1}}>
        <SegmentedControl
          options={options}
          selectedOption={option}
          onOptionPress={value => {
            setOption(value);
            fetchReport(value);
          }}
        />
      </View>
      <SpaceComponent height={10} />
      {/* <DividerComponent width={'100%'} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.white,
    padding: 8,
  },
});

export default HeaderComponent;
