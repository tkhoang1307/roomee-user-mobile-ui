import {ActivityIndicator, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {BarChart} from 'react-native-gifted-charts';
import {useTranslation} from 'react-i18next';

import {reportService} from '@services';
import {ExpenseSpendReportModel} from '@models/report';
import {appColors} from '@const/appColors';
import HeaderComponent from './HeaderComponent';
import {SpaceComponent, TextComponent} from '@components/index';
import {OptionsQueryContractEnum} from '@const/contract';
import {formatPrice, formatPriceYAxis} from '@utils/stringHelpers';

interface SpendExpenseReportProps {
  accommodationId: string;
}

const SpendExpenseReport: React.FC<SpendExpenseReportProps> = ({
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
  const [spendExpenseReport, setSpendExpenseReport] =
    useState<ExpenseSpendReportModel>();

  useEffect(() => {
    if (spendExpenseReport) {
      const convertedData = spendExpenseReport.items.map(i => {
        const d: any = {};
        d.label = i.roomName;
        d.value = i.amount;
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
      setTotal(spendExpenseReport.totalAmount);
    }
  }, [spendExpenseReport]);

  const fetchReport = async (o: number) => {
    try {
      setLoading(true);
      const report = await reportService.getExpenseReport(
        accommodationId || '',
        o,
      );
      const transformedItems = report.spend.maintenance.items.map(room => {
        const {roomName, spend} = room;
        const totalAmount = spend.reduce((sum, item) => sum + item.amount, 0);
        return {roomName, amount: totalAmount};
      });

      const reportHandled = {
        totalAmount: report.spend.maintenance.totalAmount,
        items: transformedItems,
      };
      setSpendExpenseReport(reportHandled);
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
        const transformedItems = report.spend.maintenance.items.map(room => {
          const {roomName, spend} = room;
          const totalAmount = spend.reduce((sum, item) => sum + item.amount, 0);
          return {roomName, amount: totalAmount};
        });

        const reportHandled = {
          totalAmount: report.spend.maintenance.totalAmount,
          items: transformedItems,
        };
        setSpendExpenseReport(reportHandled);
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
      <HeaderComponent
        option={option}
        setOption={setOption}
        fetchReport={fetchReport}
        title={t('report.spendExpense.label')}
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
            barBorderRadius={2}
            frontColor={appColors.danger}
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
              t('report.spendExpense.total') +
              ': ' +
              formatPrice(total) +
              ' VNĐ'
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

export default SpendExpenseReport;
