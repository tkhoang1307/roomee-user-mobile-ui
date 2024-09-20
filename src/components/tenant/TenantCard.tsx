import moment from 'moment';
import {useTranslation} from 'react-i18next';
import {useContext, useMemo, useState} from 'react';
import {Button, Modal} from '@ant-design/react-native';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {RootStackParamList} from '@models/navigators/HomNavigator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {globalStyles} from '@styles';
import {DATE_FORMAT} from '@const/format';
import {appColors} from '@const/appColors';
import {AbilityContext, Can} from '@context';
import {ContractModel} from '@models/contract';
import DetailTenantModal from './DetailTenantModal';
import RemoveTenantModal from './RemoveTenantModal';
import TextComponent from '@components/TextComponent';
import {IdentityCardModel, TenantModel} from '@models/tenant';
import {fontFamilies} from '@const/fontFamilies';
import {AbilityActionEnum, AbilitySubjectEnum} from '@const/abilities';
import TenantIdentityCardsModal from './TenantIdentityCardsModal';
import {tenantService} from '@services';
import TemporatyResidenceModal from './TemporatyResidenceModal';
import {isoToDDMMYYYY} from '@utils/convertDateFormat';

interface TenantCardProps {
  editable?: boolean;
  tenant: TenantModel;
  contract?: ContractModel | undefined;
  setContract: React.Dispatch<React.SetStateAction<ContractModel | undefined>>;
  navigation?: NativeStackNavigationProp<
    RootStackParamList,
    'DetailRoomScreen' | 'DetailContractScreen',
    undefined
  >;
  roomId?: string;
  tenants: TenantModel[];
  setTenants: React.Dispatch<React.SetStateAction<TenantModel[]>>;
}

const TenantCard: React.FC<TenantCardProps> = ({
  editable,
  tenant,
  contract,
  setContract,
  navigation,
  roomId,
  tenants,
  setTenants,
}) => {
  const {t} = useTranslation();
  const ability = useContext(AbilityContext);
  const [openMenu, setOpenMenu] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openIdCardsModal, setOpenIdCardsModal] = useState(false);
  const [openEditTemporaryResidenceModal, setOpenEditTemporaryResidenceModal] =
    useState(false);

  const lastedIdCard: IdentityCardModel = useMemo(() => {
    const index = tenant.identityCards.findIndex(
      i => i.isLatestIdentityCard === true,
    );
    return tenant.identityCards[index];
  }, [tenant]);

  const genderIcon = useMemo(() => {
    if (
      lastedIdCard &&
      (lastedIdCard.gender.toLowerCase().includes('nam') ||
        lastedIdCard.gender.toLowerCase().includes('male'))
    )
      return require('../../assets/images/male.png');
    return require('../../assets/images/female.png');
  }, []);

  const onChangeLeader = async () => {
    try {
      const updatedTenant = await tenantService.updateTenantLeader(
        roomId || '',
        tenant.id,
      );

      setContract(c => {
        if (c) {
          const updatedTenants: TenantModel[] =
            c.tenants?.map(t => {
              if (t.id === updatedTenant.id) return updatedTenant;
              return {
                ...t,
                isRoomLeader: false,
              };
            }) || [];
          return {
            ...c,
            tenants: updatedTenants || undefined,
          };
        }
        return c;
      });
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <View
      style={{
        ...globalStyles.borderInfoStyle,
        width: '100%',
        paddingVertical: 8,
        paddingHorizontal: 12,
        rowGap: 2,
      }}>
      <View style={{flexDirection: 'row', columnGap: 16}}>
        <View
          style={{
            backgroundColor: appColors.primary,
            borderRadius: 25,
            height: 50,
            width: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={genderIcon}
            style={{
              width: 40,
              height: 40,
            }}
          />
        </View>
        <View style={{flexGrow: 1}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextComponent
              styles={{fontFamily: fontFamilies.bold, fontSize: 15, flex: 1}}>
              {lastedIdCard.name}
            </TextComponent>

            {/* menu button */}
            <TouchableOpacity
              style={globalStyles.iconButton}
              onPress={() => setOpenMenu(true)}>
              <Icon name="dots-vertical" size={20} />
            </TouchableOpacity>
          </View>
          {tenant.isRoomLeader ? (
            <Text>{t('tenantInfomation.isRoomLeader')}</Text>
          ) : (
            <></>
          )}
        </View>
      </View>
      <View style={{paddingLeft: 66, rowGap: 4}}>
        <View style={globalStyles.InfoContainer}>
          <Icon name="phone-outline" size={20} />
          {tenant.email ? (
            <TextComponent>{tenant.phoneNumber}</TextComponent>
          ) : (
            <TextComponent styles={{color: appColors.gray}}>
              {t('label.notEstablished')}
            </TextComponent>
          )}
        </View>
        <View style={globalStyles.InfoContainer}>
          <Icon name="email-outline" size={20} />
          {tenant.email ? (
            <TextComponent>{tenant.email}</TextComponent>
          ) : (
            <TextComponent styles={{color: appColors.gray}}>
              {t('label.notEstablished')}
            </TextComponent>
          )}
        </View>
        <View style={globalStyles.InfoContainer}>
          <Icon name="cake-variant-outline" size={20} />
          <TextComponent>
            {`${moment(lastedIdCard.birthday).format(DATE_FORMAT)}`}
          </TextComponent>
        </View>
        {tenant.temporaryResidenceRegistrationStartDate &&
          tenant.temporaryResidenceRegistrationEndDate && (
            <>
              <View style={globalStyles.InfoContainer}>
                <TextComponent styles={{fontFamily: fontFamilies.medium}}>
                  {t('label.infoTemporaryResidence')}
                </TextComponent>
              </View>
              <View style={globalStyles.InfoContainer}>
                <TextComponent>{t('label.startDate')}</TextComponent>
                <TextComponent>
                  {tenant.temporaryResidenceRegistrationStartDate &&
                    isoToDDMMYYYY(
                      tenant.temporaryResidenceRegistrationStartDate,
                    )}
                </TextComponent>
              </View>
              <View style={globalStyles.InfoContainer}>
                <TextComponent>{t('label.endDate')}</TextComponent>
                <TextComponent>
                  {tenant.temporaryResidenceRegistrationEndDate &&
                    isoToDDMMYYYY(tenant.temporaryResidenceRegistrationEndDate)}
                </TextComponent>
              </View>
            </>
          )}
      </View>

      {/* menu */}
      <Modal
        popup
        visible={openMenu}
        maskClosable
        animationType="slide-up"
        onClose={() => setOpenMenu(false)}>
        <View>
          <Button
            style={globalStyles.menuPopupButton}
            onPress={() => {
              setOpenMenu(false);
              setOpenDetailModal(true);
            }}>
            {t('actions.viewDetailTenant')}
          </Button>
          <Button
            style={globalStyles.menuPopupButton}
            onPress={() => {
              setOpenMenu(false);
              setOpenIdCardsModal(true);
            }}>
            {t('actions.viewTenantIdCards')}
          </Button>
          {editable && (
            <Can I={AbilityActionEnum.EDIT} a={AbilitySubjectEnum.TENANT}>
              {!tenant.isRoomLeader && (
                <Button
                  style={globalStyles.menuPopupButton}
                  onPress={() => {
                    onChangeLeader();
                    setOpenMenu(false);
                  }}>
                  {t('tenantInfomation.setLeader')}
                </Button>
              )}
              <Button
                style={globalStyles.menuPopupButton}
                onPress={() => {
                  setOpenMenu(false);
                  navigation?.navigate('AddTenantIdCardScreen', {
                    roomId: contract?.roomId || '',
                    tenantId: tenant.id,
                  });
                }}>
                {t('actions.addIdentityCard')}
              </Button>
              <Button
                style={globalStyles.menuPopupButton}
                onPress={() => {
                  setOpenMenu(false);
                  setOpenEditTemporaryResidenceModal(true);
                }}>
                {t('actions.editTemporaryResidence')}
              </Button>
              <Button
                style={globalStyles.menuPopupButton}
                onPress={() => {
                  setOpenMenu(false);
                  setOpenDeleteModal(true);
                }}>
                {t('actions.deleteTenant')}
              </Button>
            </Can>
          )}
        </View>
        <Button
          type="primary"
          style={globalStyles.closePopupButton}
          onPress={() => setOpenMenu(false)}>
          {t('actions.close')}
        </Button>
      </Modal>
      {/* detail tenant */}
      <DetailTenantModal
        open={openDetailModal}
        setOpen={setOpenDetailModal}
        editable={ability.can(
          AbilityActionEnum.EDIT,
          AbilitySubjectEnum.TENANT,
        )}
        tenant={tenant}
        name={lastedIdCard?.name || ''}
        birthday={`${moment(lastedIdCard?.birthday).format(DATE_FORMAT)}`}
        gender={lastedIdCard?.gender || ''}
        setContract={setContract}
        contract={contract}
      />
      <TenantIdentityCardsModal
        open={openIdCardsModal}
        setOpen={setOpenIdCardsModal}
        tenant={tenant}
      />
      <RemoveTenantModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        tenant={tenant}
        contract={contract}
        setContract={setContract}
      />
      <TemporatyResidenceModal
        roomId={roomId || ''}
        open={openEditTemporaryResidenceModal}
        setOpen={setOpenEditTemporaryResidenceModal}
        tenant={tenant}
        tenants={tenants}
        setTenants={setTenants}
      />
    </View>
  );
};

export default TenantCard;
