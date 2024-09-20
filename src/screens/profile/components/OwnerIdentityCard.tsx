import {Alert, View} from 'react-native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ImagePreview} from 'react-native-images-preview';
import {Button} from '@ant-design/react-native';
import moment from 'moment';

import {IdentityCardModel} from '@models/tenant';
import {
  DividerComponent,
  ModalNotiComponent,
  SpaceComponent,
  TextComponent,
} from '@components/index';
import {fontFamilies} from '@const/fontFamilies';
import InfoTypo from '@components/InforTypo';
import {DATE_PICKER_FORMAT} from '@const/index';
import {appColors} from '@const/appColors';
import {NotiType} from '@models/globalComponent/ModalNotiType';
import {userService} from '@services';

interface OwnerIdCardProps {
  card: IdentityCardModel;
  setCards: React.Dispatch<React.SetStateAction<IdentityCardModel[]>>;
}

const OwnerIdentityCard: React.FC<OwnerIdCardProps> = ({card, setCards}) => {
  const {t} = useTranslation();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteIdCard = async () => {
    try {
      setLoading(true);
      await userService.deleteOwnerIdCard(card.id);
      setCards(prevs => prevs.filter(p => p.id !== card.id));
    } catch (error: any) {
      Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
        {
          text: t('actions.cancel'),
          style: 'cancel',
        },
      ]);
    } finally {
      setOpenDeleteModal(false);
      setLoading(false);
    }
  };

  return (
    <View>
      <TextComponent
        styles={{fontFamily: fontFamilies.bold, textAlign: 'center'}}
        size={20}>
        {t(`identityCard.${card.type.toLowerCase()}`).toUpperCase()}
      </TextComponent>

      <InfoTypo
        colon
        title={t('tenantInfomation.idNumber')}
        containerStyle={{flexDirection: 'row', alignItems: 'center'}}
        titleStyle={{fontFamily: fontFamilies.bold, fontSize: 16}}
        contentStyle={{fontFamily: fontFamilies.regular, fontSize: 16}}>
        {card.identityCardNumber}
      </InfoTypo>

      <InfoTypo
        colon
        title={t('tenantInfomation.name')}
        containerStyle={{flexDirection: 'row', alignItems: 'center'}}
        titleStyle={{fontFamily: fontFamilies.bold, fontSize: 16}}
        contentStyle={{fontFamily: fontFamilies.regular, fontSize: 16}}>
        {card.name}
      </InfoTypo>

      <InfoTypo
        colon
        title={t('tenantInfomation.dateOfBirth')}
        containerStyle={{flexDirection: 'row', alignItems: 'center'}}
        titleStyle={{fontFamily: fontFamilies.bold, fontSize: 16}}
        contentStyle={{fontFamily: fontFamilies.regular, fontSize: 16}}>
        {`${moment(card.birthday).format(DATE_PICKER_FORMAT)}`}
      </InfoTypo>

      <InfoTypo
        colon
        title={t('tenantInfomation.gender')}
        containerStyle={{flexDirection: 'row', alignItems: 'center'}}
        titleStyle={{fontFamily: fontFamilies.bold, fontSize: 16}}
        contentStyle={{fontFamily: fontFamilies.regular, fontSize: 16}}>
        {card.gender}
      </InfoTypo>

      <InfoTypo
        colon
        title={t('tenantInfomation.country')}
        containerStyle={{flexDirection: 'row', alignItems: 'center'}}
        titleStyle={{fontFamily: fontFamilies.bold, fontSize: 16}}
        contentStyle={{fontFamily: fontFamilies.regular, fontSize: 16}}>
        {card.country}
      </InfoTypo>

      <InfoTypo
        colon
        title={t('tenantInfomation.placeOfOrigin')}
        containerStyle={{flexDirection: 'row', alignItems: 'center'}}
        titleStyle={{fontFamily: fontFamilies.bold, fontSize: 16}}
        contentStyle={{fontFamily: fontFamilies.regular, fontSize: 16}}>
        {card.placeOfOrigin}
      </InfoTypo>

      <InfoTypo
        colon
        title={t('tenantInfomation.placeOfResidence')}
        containerStyle={{flexDirection: 'row', alignItems: 'center'}}
        titleStyle={{fontFamily: fontFamilies.bold, fontSize: 16}}
        contentStyle={{fontFamily: fontFamilies.regular, fontSize: 16}}>
        {card.placeOfResidence}
      </InfoTypo>

      <InfoTypo
        colon
        title={t('tenantInfomation.expiredTime')}
        containerStyle={{flexDirection: 'row', alignItems: 'center'}}
        titleStyle={{fontFamily: fontFamilies.bold, fontSize: 16}}
        contentStyle={{fontFamily: fontFamilies.regular, fontSize: 16}}>
        {card.expiredTime}
      </InfoTypo>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
        <ImagePreview
          imageSource={{uri: card.imageUrlFront}}
          imageStyle={{
            height: 100,
            width: 200,
            objectFit: 'contain',
            marginLeft: -12,
          }}
        />
        <ImagePreview
          imageSource={{uri: card.imageUrlBehind}}
          imageStyle={{height: 100, width: 200, objectFit: 'contain'}}
        />
      </View>
      <SpaceComponent height={10} />
      <View style={{alignItems: 'flex-end'}}>
        <Button
          type="primary"
          style={{
            backgroundColor: appColors.danger,
            width: '30%',
          }}
          onPress={() => {
            setOpenDeleteModal(true);
          }}>
          {t('actions.delete')}
        </Button>
      </View>
      <ModalNotiComponent
        loading={loading}
        type={NotiType.DANGEROUS_DECISION}
        visiable={openDeleteModal}
        title={t('room.deleteModalTitle')}
        content={t('descriptions.deleteIdCard')}
        onCancel={() => setOpenDeleteModal(false)}
        onConfirm={async () => {
          handleDeleteIdCard();
        }}
      />
      <SpaceComponent height={10} />
      <DividerComponent width="100%" styles={{borderColor: 'black'}} />
    </View>
  );
};

export default OwnerIdentityCard;
