import {ActivityIndicator, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {BarChart} from 'react-native-gifted-charts';
import {useTranslation} from 'react-i18next';

import {reportService} from '@services';
import {ExpenseTakeReportModel} from '@models/report';
import {appColors} from '@const/appColors';
import HeaderComponent from './HeaderComponent';
import {SpaceComponent, TextComponent} from '@components/index';
import {OptionsQueryContractEnum} from '@const/contract';
import {formatPrice, formatPriceYAxis} from '@utils/stringHelpers';

interface TakeExpenseReportProps {
  accommodationId: string;
}

const TakeExpenseReport: React.FC<TakeExpenseReportProps> = ({
  accommodationId,
}) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);
  const [option, setOption] = useState<number>(
    OptionsQueryContractEnum.DEFAULT,
  );
  const [total, setTotal] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number>(1);
  const [data, setData] = useState<any[]>();
  const [TakeExpenseReport, setTakeExpenseReport] =
    useState<ExpenseTakeReportModel>();

  useEffect(() => {
    if (TakeExpenseReport) {
      const convertedData = TakeExpenseReport.items.map(i => {
        const d: any = {};
        d.label = i.name;
        d.value = i.amount;
        if (d.value === undefined) {
          d.value = 0;
        }
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
      if (maxValue.value === 0) {
        maxValue.value = 1;
      }
      setData(data);
      setMaxValue(maxValue.value);
      setTotal(TakeExpenseReport.totalAmount);
    }
  }, [TakeExpenseReport]);

  const fetchReport = async (o: number) => {
    try {
      setLoading(true);
      const report = await reportService.getExpenseReport(
        accommodationId || '',
        o,
      );
      setTakeExpenseReport(report.take.rooms);
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const report = await reportService.getExpenseReport(
          accommodationId || '',
          OptionsQueryContractEnum.DEFAULT,
        );
        setTakeExpenseReport(report.take.rooms);
      } catch (error: any) {
      } finally {
        setLoading(false);
      }
    };

    setOption(OptionsQueryContractEnum.DEFAULT);
    fetchReport();
  }, [accommodationId]);

  return (
    <View style={{backgroundColor: appColors.white, overflow: 'hidden'}}>
      {/* <LoadingScreenComponent loading={loading} /> */}
      <HeaderComponent
        option={option}
        setOption={setOption}
        fetchReport={fetchReport}
        title={t('report.takeExpense.label')}
      />
      {loading ? (
        <>
          <ActivityIndicator
            size={30}
            color={appColors.primary}
            style={{justifyContent: 'center'}}
          />
          <View style={{height: 200}}></View>
        </>
      ) : (
        <View style={{padding: 8}}>
          <BarChart
            showFractionalValues
            showXAxisIndices
            xAxisIndicesWidth={1}
            xAxisIndicesHeight={1}
            formatYLabel={label => {
              return formatPriceYAxis(label);
            }}
            yAxisLabelWidth={50}
            barWidth={22}
            noOfSections={5}
            stepValue={maxValue / 5}
            barBorderRadius={4}
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
            text={
              t('report.takeExpense.total') + ': ' + formatPrice(total) + ' VNĐ'
            }
            styles={{
              textAlign: 'center',
            }}
          />
        </View>
      )}
    </View>
  );
};

export default TakeExpenseReport;
