import {ActivityIndicator, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {BarChart} from 'react-native-gifted-charts';
import {useTranslation} from 'react-i18next';

import {OptionsQueryContractEnum} from '@const/contract';
import {DensityReportModel} from '@models/report';
import {reportService} from '@services';
import {appColors} from '@const/appColors';
import HeaderComponent from './HeaderComponent';
import {SpaceComponent, TextComponent} from '@components/index';

interface DensityReportProps {
  accommodationId: string;
}
const DensityReport: React.FC<DensityReportProps> = ({accommodationId}) => {
  const {t} = useTranslation();

  const [loading, setLoading] = useState(false);
  const [option, setOption] = useState<number>(
    OptionsQueryContractEnum.DEFAULT,
  );
  const [total, setTotal] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number>(1);
  const [data, setData] = useState<any[]>();
  const [densityReport, setDensityReport] = useState<DensityReportModel>();

  useEffect(() => {
    if (densityReport) {
      const convertedData = densityReport.items.map(i => {
        const d: any = {};
        d.label = i.name;
        d.value = i.quantity;
        return d;
      });
      const data = convertedData.sort(
        (a: {label: string}, b: {label: string}) =>
          a.label.localeCompare(b.label),
      );
      const maxValue = data.reduce(
        (max, obj) => (max.value > obj.value ? max : obj),
        {value: -Infinity},
      );
      setData(data);
      setMaxValue(maxValue.value);
      setTotal(densityReport.total);
    }
  }, [densityReport]);

  const fetchReport = async (o: number) => {
    try {
      setLoading(true);
      const report = await reportService.getDensityReport(
        accommodationId || '',
        o,
      );
      setDensityReport(report);
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const report = await reportService.getDensityReport(
          accommodationId || '',
          OptionsQueryContractEnum.DEFAULT,
        );

        setDensityReport(report);
      } catch (error: any) {
      } finally {
        setLoading(false);
      }
    };

    setOption(OptionsQueryContractEnum.DEFAULT);
    fetchReport();
  }, [accommodationId]);
  return (
    <View
      style={{
        backgroundColor: appColors.white,
        overflow: 'hidden',
        paddingRight: 8,
      }}>
      {/* <LoadingScreenComponent loading={loading} /> */}
      <HeaderComponent
        option={option}
        setOption={setOption}
        fetchReport={fetchReport}
        title={t('report.density.label')}
      />
      {loading ? (
        <View style={{height: 280}}>
          <ActivityIndicator
            size={30}
            color={appColors.primary}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '30%',
            }}
          />
        </View>
      ) : (
        <View style={{padding: 8}}>
          <BarChart
            showXAxisIndices
            xAxisIndicesWidth={1}
            xAxisIndicesHeight={1}
            barWidth={22}
            noOfSections={maxValue}
            barBorderRadius={2}
            frontColor={appColors.primary}
            data={data}
            yAxisThickness={0.4}
            xAxisThickness={0.4}
            scrollAnimation
            maxValue={maxValue}
            backgroundColor={appColors.white}
          />
          <SpaceComponent height={10} />
          <TextComponent
            text={t('report.density.total') + ': ' + total.toString()}
            styles={{
              textAlign: 'center',
            }}
          />
        </View>
      )}
    </View>
  );
};

export default DensityReport;
