import {View} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {ReportScreenProps} from '@models/navigators/HomNavigator';
import {
  ContainerComponent,
  SectionComponent,
  TitleComponent,
} from '@components/index';
import {globalStyles} from '@styles';
import {appColors} from '@const/appColors';
import ContractReport from './components/ContractReport';
import DensityReport from './components/DensityReport';
import SpendExpenseReport from './components/SpendExpenseReport';
import TakeExpenseReport from './components/TakeExpenseReport';

const ReportScreen: React.FC<ReportScreenProps> = ({route}) => {
  const {t} = useTranslation();
  // const [loading, setLoading] = useState<boolean>(false);
  const {accommodationId} = route.params;

  return (
    <View style={[globalStyles.container, {position: 'relative'}]}>
      <TitleComponent
        back
        title={t('label.reports')}
        titleStyle={{fontSize: 20, marginTop: -2}}
      />

      <SectionComponent styles={{flexDirection: 'row', alignItems: 'center'}}>
        {/* <LoadingScreenComponent loading={loading} /> */}
        <View
          style={{
            height: '100%',
            backgroundColor: appColors.primary,
            width: 5,
            borderRadius: 4,
            marginRight: 10,
          }}
        />
        {/* <TextComponent
        text={`${t('accommodation.accommodationText')}: ${accommodationName}`}
        styles={{fontFamily: fontFamilies.medium, fontSize: 20}}
      /> */}
      </SectionComponent>

      <ContainerComponent isScroll>
        <SectionComponent styles={{gap: 12}}>
          <DensityReport accommodationId={accommodationId} />

          <ContractReport accommodationId={accommodationId} />

          <SpendExpenseReport accommodationId={accommodationId} />

          <TakeExpenseReport accommodationId={accommodationId} />
        </SectionComponent>
      </ContainerComponent>
    </View>
  );
};

export default ReportScreen;
