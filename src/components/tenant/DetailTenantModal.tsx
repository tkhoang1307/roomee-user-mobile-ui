import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, Modal, View} from '@ant-design/react-native';
import {Alert, ScrollView, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {globalStyles} from '@styles';
import {tenantService} from '@services';
import {TenantModel} from '@models/tenant';
import InfoTypo from '@components/InforTypo';
import {ContractModel} from '@models/contract';
import InputComponent from '@components/InputComponent';

interface DetailTenantProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editable?: boolean;
  tenant: TenantModel;
  contract: ContractModel | undefined;
  setContract: React.Dispatch<React.SetStateAction<ContractModel | undefined>>;
  name: string;
  birthday: string;
  gender: string;
}

const DetailTenantModal: React.FC<DetailTenantProps> = ({
  open,
  setOpen,
  editable,
  tenant,
  name,
  birthday,
  gender,
  contract,
  setContract,
}) => {
  const {t} = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [openEditPhoneNumber, setOpenEditPhoneNumber] = useState(false);
  const [email, setEmail] = useState('');
  const [openEditEmail, setOpenEditEmail] = useState(false);

  const onChangePhoneNumber = async () => {
    if (phoneNumber.length === 0 || phoneNumber === tenant.phoneNumber) return;
    const numReg = /^\d+$/;
    const oldContract = contract;
    if (numReg.test(phoneNumber)) {
      try {
        setContract(c => {
          if (c) {
            const updatedTenants: TenantModel[] =
              c.tenants?.map(t => {
                if (t.id === tenant.id)
                  return {
                    ...t,
                    phoneNumber: phoneNumber,
                  };
                return t;
              }) || [];
            return {
              ...c,
              tenants: updatedTenants || undefined,
            };
          }
          return c;
        });
        setOpenEditPhoneNumber(false);

        await tenantService.updateTenantPhoneNumber(
          phoneNumber,
          contract?.roomId || '',
          tenant.id,
        );
      } catch (error: any) {
        Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
          {
            text: t('actions.cancel'),
            style: 'cancel',
          },
        ]);
        setContract(oldContract);
      }
    }
  };

  const onChangeEmail = async () => {
    if (email.length === 0 || email === tenant.email) return;
    const emailReg =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const oldContract = contract;

    if (emailReg.test(email)) {
      try {
        setContract(c => {
          if (c) {
            const updatedTenants: TenantModel[] =
              c.tenants?.map(t => {
                if (t.id === tenant.id)
                  return {
                    ...t,
                    email: email,
                  };
                return t;
              }) || [];
            return {
              ...c,
              tenants: updatedTenants || undefined,
            };
          }
          return c;
        });
        setOpenEditEmail(false);

        await tenantService.updateTenantEmail(
          email,
          contract?.roomId || '',
          tenant.id,
        );
      } catch (error: any) {
        Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
          {
            text: t('actions.cancel'),
            style: 'cancel',
          },
        ]);
        setContract(oldContract);
      }
    } else {
      Alert.alert(t('alertTitle.noti'), t('validation.tenantEmailType'), [
        {
          text: t('actions.cancel'),
          style: 'cancel',
        },
      ]);
    }
  };

  return (
    <Modal
      popup
      visible={open}
      maskClosable
      animationType="slide-up"
      onClose={() => setOpen(false)}>
      <ScrollView style={{maxHeight: 600}}>
        <View style={{paddingHorizontal: 16, paddingVertical: 8, rowGap: 8}}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'flex-end',
            }}>
            <Icon name="account-outline" size={24} style={{height: 32}} />
            <View>
              <InfoTypo
                colon
                titleStyle={{fontSize: 20}}
                contentStyle={{fontSize: 20}}>
                {name}
              </InfoTypo>
            </View>
          </View>
          {tenant.isRoomLeader ? (
            <Text style={{marginLeft: 30}}>
              {t('tenantInfomation.isRoomLeader')}
            </Text>
          ) : (
            <></>
          )}

          <View style={globalStyles.InfoContainer}>
            <Icon name="phone-outline" size={20} />
            {!openEditPhoneNumber ? (
              <InfoTypo
                title={t('tenantInfomation.phoneNumber')}
                colon
                containerStyle={globalStyles.InfoContainer}>
                {tenant.phoneNumber}
              </InfoTypo>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  columnGap: 4,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <InputComponent
                  styleInput={{maxWidth: 200, marginTop: 0}}
                  value={phoneNumber}
                  numeric
                  onChange={val =>
                    setPhoneNumber(isNaN(+val) ? phoneNumber : val)
                  }
                />
                <View style={{flexDirection: 'row', columnGap: 8}}>
                  <TouchableOpacity
                    style={{...globalStyles.iconButton, height: 34, width: 34}}
                    onPress={() => onChangePhoneNumber()}>
                    <Icon name="check" size={20} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{...globalStyles.iconButton, height: 34, width: 34}}
                    onPress={() => setOpenEditPhoneNumber(false)}>
                    <Icon name="window-close" size={20} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {editable && !openEditPhoneNumber && (
              <TouchableOpacity
                style={{...globalStyles.iconButton, height: 34, width: 34}}
                onPress={() => {
                  setPhoneNumber(tenant.phoneNumber);
                  setOpenEditPhoneNumber(true);
                }}>
                <Icon name="pencil" size={20} />
              </TouchableOpacity>
            )}
          </View>

          <View style={globalStyles.InfoContainer}>
            <Icon name="email-outline" size={20} />
            {!openEditEmail ? (
              <InfoTypo
                title={t('tenantInfomation.email')}
                colon
                containerStyle={globalStyles.InfoContainer}>
                {tenant.email}
              </InfoTypo>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  columnGap: 4,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <InputComponent
                  styleInput={{maxWidth: 200, marginTop: 0}}
                  value={email}
                  numeric
                  onChange={val => setEmail(val)}
                />
                <View style={{flexDirection: 'row', columnGap: 8}}>
                  <TouchableOpacity
                    style={{...globalStyles.iconButton, height: 34, width: 34}}
                    onPress={() => onChangeEmail()}>
                    <Icon name="check" size={20} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{...globalStyles.iconButton, height: 34, width: 34}}
                    onPress={() => setOpenEditEmail(false)}>
                    <Icon name="window-close" size={20} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {editable && !openEditEmail && (
              <TouchableOpacity
                style={{...globalStyles.iconButton, height: 34, width: 34}}
                onPress={() => {
                  setEmail(tenant.email || '');
                  setOpenEditEmail(true);
                }}>
                <Icon name="pencil" size={20} />
              </TouchableOpacity>
            )}
          </View>

          <View style={globalStyles.InfoContainer}>
            <Icon name="cake-variant-outline" size={20} />
            <InfoTypo
              title={t('tenantInfomation.dateOfBirth')}
              colon
              containerStyle={globalStyles.InfoContainer}>
              {birthday}
            </InfoTypo>
          </View>

          <View style={globalStyles.InfoContainer}>
            <Icon name="gender-male-female" size={20} />
            <InfoTypo
              title={t('tenantInfomation.sex')}
              colon
              containerStyle={globalStyles.InfoContainer}>
              {t(`tenantInfomation.${gender.toLowerCase()}`)}
            </InfoTypo>
          </View>
        </View>
      </ScrollView>
      <Button
        type="primary"
        style={globalStyles.closePopupButton}
        onPress={() => setOpen(false)}>
        {t('actions.close')}
      </Button>
    </Modal>
  );
};

export default DetailTenantModal;
