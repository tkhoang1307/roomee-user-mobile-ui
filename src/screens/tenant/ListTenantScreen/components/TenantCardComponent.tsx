import {
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  Image,
  Linking,
} from 'react-native';
import React, {useMemo} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';

import {appColors} from '@const/appColors';
import RowComponent from '@components/RowComponent';
import IconCircleComponent from '@components/IconCircleComponent';
import {TextComponent} from '@components/index';
import {fontFamilies} from '@const/fontFamilies';
import {globalStyles} from '@styles';
import {isoToDDMMYYYY} from '@utils/convertDateFormat';

interface TenantCardProps {
  gender?: string;
  name: string;
  phone: string;
  status: boolean;
  roomName: string;
  styles?: StyleProp<ViewStyle>;
  startDate?: string;
  endDate?: string;
}

const TenantCardComponent = (props: TenantCardProps) => {
  const {name, gender, phone, startDate, endDate, status, styles, roomName} =
    props;
  const {t} = useTranslation();

  const genderIcon = useMemo(() => {
    if (
      gender &&
      (gender.toLowerCase().includes('nam') ||
        gender.toLowerCase().includes('male'))
    )
      return require('../../../../assets/images/male.png');
    return require('../../../../assets/images/female.png');
  }, []);

  return (
    <View
      style={[
        {
          backgroundColor: appColors.white,
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
          borderRadius: 10,
        },
        styles,
      ]}>
      <View style={{flexGrow: 1, justifyContent: 'center'}}>
        {gender ? (
          <Image
            source={genderIcon}
            style={{
              width: 60,
              height: 60,
            }}
          />
        ) : (
          <Icon name="account-circle" size={60} />
        )}
      </View>
      <View style={{justifyContent: 'space-evenly', flexGrow: 7}}>
        <RowComponent
          styles={{justifyContent: 'space-between', alignItems: 'flex-start'}}>
          <View>
            <TextComponent
              text={name}
              styles={{fontFamily: fontFamilies.semiBold}}
              size={16}
            />
            <TextComponent
              size={15}
              styles={{fontFamily: fontFamilies.medium}}
              text={`${t('room.room')}: ${roomName}`}
            />
            {phone !== '' && <TextComponent text={`SĐT: ${phone}`} size={15} />}
            {startDate && endDate && (
              <>
                <View style={globalStyles.InfoContainer}>
                  <TextComponent
                    styles={{fontFamily: fontFamilies.medium, marginTop: 5}}>
                    {t('label.infoTemporaryResidence')}
                  </TextComponent>
                </View>
                <View style={globalStyles.InfoContainer}>
                  <TextComponent>{t('label.startDate') + ':'}</TextComponent>
                  <TextComponent>
                    {startDate && isoToDDMMYYYY(startDate)}
                  </TextComponent>
                </View>
                <View style={globalStyles.InfoContainer}>
                  <TextComponent>{t('label.endDate') + ':'}</TextComponent>
                  <TextComponent>
                    {endDate && isoToDDMMYYYY(endDate)}
                  </TextComponent>
                </View>
              </>
            )}
            <View
              style={{
                backgroundColor: appColors.gray3,
                marginTop: 15,
                borderRadius: 10,
                paddingHorizontal: 10,
                paddingBottom: 3,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Icon
                name="checkbox-blank-circle"
                size={10}
                color={status ? appColors.success : 'red'}
              />
              <TextComponent
                text={status ? t('room.useApp') : t('room.dontUseApp')}
                size={12}
                styles={{marginBottom: 2, marginLeft: 5}}
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL('tel:' + phone);
            }}>
            <IconCircleComponent
              name="phone"
              colorCircle={appColors.success}
              colorIcon={appColors.white}
              sizeCircle={50}
              sizeIcon={28}
            />
          </TouchableOpacity>
        </RowComponent>
      </View>
    </View>
  );
};

export default TenantCardComponent;
