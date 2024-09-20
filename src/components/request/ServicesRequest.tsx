import {ActivityIndicator, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {appColors} from '@const/appColors';
import {MONEY_FORMAT_BY} from '@const/index';
import {RequestModel} from '@models/request';
import {serviceUtilityServices} from '@services';
import TextComponent from '@components/TextComponent';
import {ServiceAccommodationResponseModel} from '@models/service-utility';

interface ServiceRequestProps {
  request: RequestModel;
}

const ServiceRequest: React.FC<ServiceRequestProps> = ({request}) => {
  const {t} = useTranslation();
  const [services, setServices] = useState<ServiceAccommodationResponseModel[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getServices = async () => {
      setLoading(true);
      try {
        const [accommodationServices] = await Promise.all([
          serviceUtilityServices.getAllServicesForAccommodation(
            request.accommodationId,
            'ALL',
          ),
        ]);

        const selectedServiceIds =
          (request.meta.accommodationServiceIds as string[]) || [];

        const selectedServices = accommodationServices.filter(s =>
          selectedServiceIds.includes(s.id),
        );

        setServices(selectedServices);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getServices();
  }, []);

  return (
    <View
      style={{
        minHeight: 20,
        paddingHorizontal: 12,
        rowGap: 4,
      }}>
      <TextComponent color={appColors.gray}>
        {t('request.service') + ':'}
      </TextComponent>

      {loading ? (
        <View style={{alignItems: 'center'}}>
          <ActivityIndicator size={30} color={appColors.primary} />
        </View>
      ) : (
        services.map(s => (
          <View
            key={s.id}
            style={{
              backgroundColor: '#FFF',
              borderBottomColor: '#E0E0E0',
              flexDirection: 'row',
              alignItems: 'center',
              padding: 4,
            }}>
            <Icon name={'circle-medium'} color={appColors.black} size={20} />
            <TextComponent>{t(`service.${s.name}.name`) + ': '}</TextComponent>
            <TextComponent>
              {s.cost.toString().replace(MONEY_FORMAT_BY, ',')} /{' '}
              {t(`service.${s.name}.unit.${s.unit}`)}
            </TextComponent>
          </View>
        ))
      )}
    </View>
  );
};

export default ServiceRequest;
