import {Alert, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Modal} from '@ant-design/react-native';

import {tenantService} from '@services';
import {appColors} from '@const/appColors';
import {TenantModel} from '@models/tenant';
import {ContractModel} from '@models/contract';
import TextComponent from '@components/TextComponent';

interface RemoveTenantModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  contract: ContractModel | undefined;
  setContract: React.Dispatch<React.SetStateAction<ContractModel | undefined>>;
  tenant: TenantModel;
}

const RemoveTenantModal: React.FC<RemoveTenantModalProps> = ({
  open,
  setOpen,
  setContract,
  contract,
  tenant,
}) => {
  const {t} = useTranslation();

  const handleRemove = async () => {
    try {
      await tenantService.deleteTenant(tenant.id, contract?.roomId || '');
      setContract(c => {
        if (!c) return c;
        const newTenants = c.tenants?.filter(t => t.id !== tenant.id);
        return {
          ...c,
          tenants: newTenants,
        };
      });
    } catch (error: any) {
      Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
        {
          text: t('actions.cancel'),
          style: 'cancel',
        },
      ]);
    } finally {
      setOpen(false);
    }
  };

  return (
    <Modal
      title={t('actions.deleteTenant')}
      transparent
      maskClosable
      visible={open}
      onClose={() => setOpen(false)}
      footer={[
        {text: t('actions.cancel'), onPress: () => {}},
        {
          text: t('actions.submit'),
          onPress: handleRemove,
          style: {color: appColors.danger},
        },
      ]}>
      <View
        style={{
          width: '100%',
          marginTop: 8,
        }}>
        <TextComponent>{t('descriptions.deleteTenant')}</TextComponent>
      </View>
    </Modal>
  );
};

export default RemoveTenantModal;
