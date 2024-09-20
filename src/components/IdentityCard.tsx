import moment from 'moment';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import InfoTypo from './InforTypo';
import {globalStyles} from '@styles';
import {DATE_FORMAT} from '@const/format';
import TextComponent from './TextComponent';
import {IdentityCardModel} from '@models/tenant';
import {fontFamilies} from '@const/fontFamilies';

interface IdentityCardProps {
  card: IdentityCardModel;
  lasted?: boolean;
}

const IdentityCard: React.FC<IdentityCardProps> = ({card, lasted}) => {
  const {t} = useTranslation();

  return (
    <View style={{rowGap: 2, padding: 8}}>
      <View>
        <TextComponent
          styles={{
            flex: 1,
            textAlign: 'center',
            fontFamily: fontFamilies.bold,
            fontSize: 16,
          }}>
          {`${t(`identityCard.${card.type.toLowerCase()}`).toUpperCase()} ${
            lasted ? `(${t('label.lastest').toLowerCase()})` : ''
          }`}
        </TextComponent>
      </View>

      <InfoTypo
        colon
        containerStyle={globalStyles.InfoContainer}
        title={t('tenantInfomation.idNumber')}>
        {card.identityCardNumber}
      </InfoTypo>

      <InfoTypo
        colon
        containerStyle={globalStyles.InfoContainer}
        title={t('tenantInfomation.name')}>
        {card.name}
      </InfoTypo>
      <InfoTypo
        colon
        containerStyle={globalStyles.InfoContainer}
        title={t('tenantInfomation.dateOfBirth')}>
        {`${moment(card.birthday).format(DATE_FORMAT)}`}
      </InfoTypo>

      <InfoTypo
        colon
        containerStyle={globalStyles.InfoContainer}
        title={t('tenantInfomation.gender')}>
        {card.gender}
      </InfoTypo>
      <InfoTypo
        colon
        containerStyle={globalStyles.InfoContainer}
        title={t('tenantInfomation.country')}>
        {card.country}
      </InfoTypo>
      <InfoTypo
        colon
        containerStyle={globalStyles.InfoContainer}
        title={t('tenantInfomation.placeOfOrigin')}>
        {card.placeOfOrigin}
      </InfoTypo>
      <InfoTypo
        colon
        containerStyle={globalStyles.InfoContainer}
        title={t('tenantInfomation.placeOfResidence')}>
        {card.placeOfResidence}
      </InfoTypo>
      <InfoTypo
        colon
        containerStyle={globalStyles.InfoContainer}
        title={t('tenantInfomation.expiredTime')}>
        {card.expiredTime}
      </InfoTypo>
    </View>
  );
};

export default IdentityCard;
