import {ActivityIndicator, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {PieChart, pieDataItem} from 'react-native-gifted-charts';

import {ContractReportModel} from '@models/report';
import {OptionsQueryContractEnum} from '@const/contract';
import {reportService} from '@services';
import {appColors} from '@const/appColors';
import {SpaceComponent, TextComponent} from '@components/index';
import HeaderComponent from './HeaderComponent';

interface ContractReportProps {
  accommodationId: string;
}

const ContractReport: React.FC<ContractReportProps> = ({accommodationId}) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<pieDataItem[]>([]);
  const [contractReport, setContractReport] = useState<ContractReportModel>();
  const [option, setOption] = useState<number>(
    OptionsQueryContractEnum.DEFAULT,
  );
  useEffect(() => {
    const formatData = () => {
      const labels: string[] = [];
      labels.push(t('state.contract.PROCESSING')); // processing + created
      labels.push(t('state.contract.FAILED'));
      labels.push(t('state.contract.TERMINATED'));
      labels.push(t('state.contract.EXPIRED'));
      labels.push(t('state.contract.COMPLETED'));

      const reportData = [
        (contractReport?.created || 0) + (contractReport?.processing || 0),
        contractReport?.failed || 0,
        contractReport?.terminated || 0,
        contractReport?.expired || 0,
        contractReport?.completed || 0,
      ];
      const total = reportData.reduce((sum, num) => sum + num, 0);

      const dataReport: pieDataItem[] = reportData.map((value, index) => ({
        value: value, // Ensure non-zero values for pie chart rendering
        color: [
          'rgba(3, 162, 255, 1)', //blue
          'rgba(255, 77, 79, 1)', //light red
          'rgba(212, 136, 6, 1)', // yellow
          'rgba(109,109,116, 1)', // grey
          'rgba(82, 196, 26, 1)', //green
        ][index],
      }));
      setData(dataReport);
      setTotal(total);
    };

    if (contractReport) {
      formatData();
    }
  }, [contractReport]);

  const fetchReport = async (o: number) => {
    try {
      setLoading(true);
      const report = await reportService.getContractReport(
        accommodationId || '',
        o,
      );
      setContractReport(report);
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const report = await reportService.getContractReport(
          accommodationId || '',
          OptionsQueryContractEnum.DEFAULT,
        );
        setContractReport(report);
      } catch (error: any) {
        //TODO: handle error
        console.log('error', error);
      } finally {
        setLoading(false);
      }
    };

    setOption(OptionsQueryContractEnum.DEFAULT);
    fetchReport();
  }, [accommodationId]);
  return (
    <View style={{backgroundColor: appColors.white}}>
      {/* <LoadingScreenComponent loading={loading} /> */}
      <HeaderComponent
        option={option}
        setOption={setOption}
        fetchReport={fetchReport}
        title={t('report.contract.label')}
      />

      {loading ? (
        <View style={{height: 220}}>
          <ActivityIndicator
            size={30}
            color={appColors.primary}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '25%',
            }}
          />
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <PieChart
            data={data}
            radius={100}
            showText
            textColor="#ffffff"
            textSize={16}
            focusOnPress
            showValuesAsLabels
            animationDuration={1000}
            isAnimated
            innerRadius={60}
            innerCircleColor={'#ffffff'}
            centerLabelComponent={() => {
              return (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                />
              );
            }}
          />
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: 120,
                marginRight: 20,
              }}>
              {renderDot('rgba(82, 196, 26, 1)')}
              <TextComponent
                text={t('state.contract.COMPLETED')}
                styles={{color: appColors.text, paddingBottom: 3}}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: 120,
                marginRight: 20,
              }}>
              {renderDot('rgba(3, 162, 255, 1)')}
              <TextComponent
                text={t('state.contract.PROCESSING')}
                styles={{color: appColors.text, paddingBottom: 3}}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: 120,
                marginRight: 20,
              }}>
              {renderDot('rgba(212, 136, 6, 1)')}
              <TextComponent
                text={t('state.contract.TERMINATED')}
                styles={{color: appColors.text, paddingBottom: 3}}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: 120,
                marginRight: 20,
              }}>
              {renderDot('rgba(109,109,116, 1)')}
              <TextComponent
                text={t('state.contract.EXPIRED')}
                styles={{color: appColors.text, paddingBottom: 3}}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: 120,
                marginRight: 20,
              }}>
              {renderDot('rgba(255, 77, 79, 1)')}
              <TextComponent
                text={t('state.contract.FAILED')}
                styles={{color: appColors.text, paddingBottom: 3}}
              />
            </View>
          </View>
        </View>
      )}
      <TextComponent
        text={t('report.density.total') + ': ' + total.toString()}
        styles={{
          textAlign: 'center',
        }}
      />
      <SpaceComponent height={10} />
    </View>
  );
};

export default ContractReport;

const renderDot = (color: string) => {
  return (
    <View
      style={{
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: color,
        marginRight: 10,
      }}
    />
  );
};
