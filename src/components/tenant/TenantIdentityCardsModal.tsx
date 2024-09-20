import {Button, Modal} from '@ant-design/react-native';
import IdentityCard from '@components/IdentityCard';
import {appColors} from '@const/appColors';
import {TenantModel} from '@models/tenant';
import {globalStyles} from '@styles';
import {useTranslation} from 'react-i18next';
import {ScrollView, View} from 'react-native';

interface TenantIdentityCardsModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tenant: TenantModel;
}

const TenantIdentityCardsModal: React.FC<TenantIdentityCardsModalProps> = ({
  open,
  setOpen,
  tenant,
}) => {
  const {t} = useTranslation();

  return (
    <Modal
      popup
      visible={open}
      maskClosable
      animationType="slide-up"
      onClose={() => setOpen(false)}>
      <ScrollView style={{maxHeight: 800, paddingTop: 8}}>
        <View>
          {tenant.identityCards.map(c => (
            <View
              key={c.id}
              style={{borderBottomWidth: 1, borderColor: appColors.gray2}}>
              <IdentityCard card={c} lasted={c.isLatestIdentityCard} />
            </View>
          ))}
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

export default TenantIdentityCardsModal;
