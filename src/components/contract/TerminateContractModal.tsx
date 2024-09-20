import {useState} from 'react';
import {Alert, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Checkbox, Modal} from '@ant-design/react-native';

import {contractService} from '@services';
import {appColors} from '@const/appColors';
import {ContractModel} from '@models/contract';
import TextComponent from '@components/TextComponent';

interface TerminateContractModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  contract: ContractModel | undefined;
  setContract: React.Dispatch<React.SetStateAction<ContractModel | undefined>>;
}

const TerminateContractModal: React.FC<TerminateContractModalProps> = ({
  open,
  setOpen,
  setContract,
  contract,
}) => {
  const {t} = useTranslation();
  const [isRefundDeposit, setIsRefundDeposit] = useState(false);
  const [isCheckedProperties, setIsCheckedProperties] = useState(false);

  return (
    <Modal
      title={t('label.terminateContract')}
      transparent
      maskClosable
      visible={open}
      onClose={() => setOpen(false)}
      footer={[
        {text: t('actions.cancel'), onPress: () => {}},
        {
          text: t('actions.submit'),
          onPress: () => {
            const oldContract = contract;
            try {
              contractService.terminateContract(contract?.id || '', {
                isRefundDeposit,
                isCheckedProperties,
              });
              setContract(undefined);
            } catch (error: any) {
              Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
                {
                  text: t('actions.cancel'),
                  style: 'cancel',
                },
              ]);
              setContract(oldContract);
            }
          },
          style: {color: appColors.danger},
        },
      ]}>
      <View
        style={{
          width: '100%',
          marginTop: 8,
        }}>
        <TextComponent>{t('descriptions.terminateContract')}</TextComponent>
        <Checkbox
          checked={isRefundDeposit}
          onChange={e => setIsRefundDeposit(e.target.checked)}
          style={{
            borderTopWidth: 0.5,
            borderBottomWidth: 0.5,
            borderColor: appColors.gray3,
            paddingVertical: 16,
            marginTop: 8,
          }}>
          {t('label.refundedDeposit')}
        </Checkbox>
        <Checkbox
          checked={isCheckedProperties}
          onChange={e => setIsCheckedProperties(e.target.checked)}
          style={{
            borderTopWidth: 0.5,
            borderBottomWidth: 0.5,
            borderColor: appColors.gray3,
            paddingVertical: 16,
            width: '100%',
          }}>
          {t('label.checkedProperties')}
        </Checkbox>
      </View>
    </Modal>
  );
};

export default TerminateContractModal;
