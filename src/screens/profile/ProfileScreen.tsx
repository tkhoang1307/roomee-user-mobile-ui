import {View, Text, Image} from 'react-native';
import React, {useContext, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Flex} from '@ant-design/react-native';
import {IconOutline} from '@ant-design/icons-react-native';

import RowComponent from '@components/RowComponent';
import {
  ButtonComponent,
  Can,
  ModalNotiComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '@components/index';
import {AuthContext, UserContext} from '@context';
import {ProfileScreenStyles} from './styles';
import {globalStyles} from '@styles';
import {appColors} from '@const/appColors';
import {AuthConst, UserConst} from '@const/index';
import {fontFamilies} from '@const/fontFamilies';
import {ProfileScreenProps} from '@models/navigators/ProfileNavigator';
import {AbilityActionEnum, AbilitySubjectEnum} from '@const/abilities';
import {NotiType} from '@models/globalComponent/ModalNotiType';

const ProfileScreen: React.FC<ProfileScreenProps> = ({navigation}) => {
  const {t} = useTranslation();
  const {userState, userDispatch} = useContext(UserContext);
  const {authDispatch} = useContext(AuthContext);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleLogout = async () => {
    authDispatch({type: AuthConst.LOG_OUT});
    userDispatch({type: UserConst.LOG_OUT});
  };
  return (
    <View style={globalStyles.container}>
      <SectionComponent
        styles={{
          backgroundColor: appColors.secondary,
          paddingTop: 10,
          paddingBottom: 10,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          position: 'relative',
          overflow: 'hidden',
        }}>
        <TextComponent
          font={fontFamilies.bold}
          styles={{
            color: appColors.white,
            textAlign: 'center',
            textAlignVertical: 'top',
            paddingBottom: 4,
            fontSize: 20,
          }}
          title
          text={t('pageTitle.profile')}
        />
      </SectionComponent>
      <SpaceComponent height={20} />
      <SectionComponent>
        <RowComponent>
          <RowComponent styles={{flex: 1}}>
            <Image
              source={{uri: userState.imageUrl}}
              style={ProfileScreenStyles.imageStyle}
            />
          </RowComponent>
          <RowComponent
            styles={ProfileScreenStyles.rowHeadingStyle}
            justify="flex-start">
            <Flex
              direction="column"
              justify="around"
              align="start"
              style={{height: 80}}>
              <Text style={globalStyles.textContent}>
                {t(`accountDetail.role.${userState.role.toLowerCase()}`)}
              </Text>
              <Text style={globalStyles.textHeading}>{userState.name}</Text>
              <Text style={globalStyles.textContent}>{userState.username}</Text>
            </Flex>
          </RowComponent>
        </RowComponent>
      </SectionComponent>

      <SectionComponent>
        <ButtonComponent
          styles={{height: 44, paddingVertical: 6}}
          onPress={() => {
            navigation.navigate('EditProfileScreen');
          }}
          type="primary"
          text={t('actions.editProfile')}
        />
      </SectionComponent>

      <SectionComponent>
        <ButtonComponent
          onPress={() => {
            navigation.navigate('DetailLanguageScreen');
          }}
          type="action"
          textStyles={{fontSize: 18, paddingBottom: 4}}
          text={t('actions.changeLanguage')}
          iconAction={<IconOutline name="global" size={24} />}
          icon={<IconOutline name="right" />}
          iconFlex="right"
        />

        <Can I={AbilityActionEnum.UPSERT} a={AbilitySubjectEnum.OWNER_ID_CARD}>
          <ButtonComponent
            onPress={() => {
              navigation.navigate('ListIdentityCardScreen');
            }}
            type="action"
            textStyles={{fontSize: 18, paddingBottom: 4}}
            text={t('actions.viewIdCard')}
            iconAction={
              <IconOutline
                name="idcard"
                size={24}
                // style={{color: appColors.danger}}
              />
            }
            icon={<IconOutline name="right" />}
            iconFlex="right"
          />
        </Can>
        <ModalNotiComponent
          type={NotiType.DANGEROUS_DECISION}
          visiable={openDeleteModal}
          title={t('room.deleteModalTitle')}
          content={t('label.logout')}
          onCancel={() => setOpenDeleteModal(false)}
          onConfirm={async () => {
            handleLogout();
          }}
        />

        <ButtonComponent
          onPress={() => {
            setOpenDeleteModal(true);
          }}
          type="action"
          textStyles={{fontSize: 18, paddingBottom: 4, color: appColors.danger}}
          text={t('actions.logOut')}
          iconAction={
            <IconOutline
              name="logout"
              size={24}
              style={{color: appColors.danger}}
            />
          }
          icon={<IconOutline name="right" />}
          iconFlex="right"
        />
      </SectionComponent>
    </View>
  );
};

export default ProfileScreen;
