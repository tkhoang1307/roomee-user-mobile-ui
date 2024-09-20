import {View, Alert, Text} from 'react-native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Modal} from '@ant-design/react-native';

import InputComponent from '@components/InputComponent';
import {TextComponent} from '@components/index';
import {appColors} from '@const/appColors';
import {MONEY_FORMAT_BY} from '@const/index';
import {ErrorResponseAxios} from '@models/error';
import {CreationInvoiceItemPropertyModel} from '@models/invoices';
import {isNumeric} from '@utils/accommodation';
import { generateUUID } from '@utils/uuidHelpers';

interface CreateInvoiceOtherItemsModalProps {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  propertyInvoiceItems: CreationInvoiceItemPropertyModel[];
  setPropertyInvoiceItems: React.Dispatch<
    React.SetStateAction<CreationInvoiceItemPropertyModel[]>
  >;
}

const CreateInvoiceOtherItemsModal: React.FC<CreateInvoiceOtherItemsModalProps> = ({
  modalOpen,
  setModalOpen,
  propertyInvoiceItems,
  setPropertyInvoiceItems,
}) => {
  const {t} = useTranslation();

  const [costName, setCostName] = useState<string>('');
  const [cost, setCost] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');

  const handleAddInvoiceItem = async () => {
    try {
      if (!costName || !cost || !quantity) {
        Alert.alert(t(`alertTitle.noti`), t(`alertContent.fillNotEnough`));
        return;
      }

      const uuidKey = generateUUID();
      const payload: CreationInvoiceItemPropertyModel = {
        key: uuidKey,
        roomTenantPropertyId: uuidKey,
        name: costName,
        cost: parseFloat(cost),
        quantity: parseFloat(quantity),
      };
      setPropertyInvoiceItems([...propertyInvoiceItems, payload]);
    } catch (error: any) {
      Alert.alert(
        t(`alertTitle.noti`),
        (error as ErrorResponseAxios).response.data.message,
      );
    } finally {
      handleFinally();
    }
  };

  const handleFinally = () => {
    setCostName('');
    setCost('');
    setQuantity('');
    setModalOpen(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalOpen}
      maskClosable
      onClose={() => handleFinally()}
      footer={[
        {
          text: t('actions.cancel'),
          onPress: () => {},
          style: {color: appColors.danger},
        },
        {
          text: t('actions.addMore'),
          onPress: () => handleAddInvoiceItem(),
          style: {color: appColors.primary},
        },
      ]}>
      <View style={{width: '110%'}}>
        <View style={{width: '90%'}}>
          <TextComponent
            text={t('actions.addService')}
            styles={{marginBottom: 10}}
          />

          <>
            <View style={{width: '100%'}}>
              <InputComponent
                placeholder={t('placeholders.nameRepairCost')}
                value={costName}
                onChange={value => setCostName(value)}
              />
            </View>
            <View style={{width: '100%', marginTop: -16}}>
              <InputComponent
                placeholder={t('placeholders.cost')}
                type="numeric"
                value={cost}
                onChange={value => {
                  if (value === '') {
                    setCost(value);
                  }
                  if (isNumeric(value)) {
                    setCost(value);
                  }
                }}
                suffix={<Text>{'₫'}</Text>}
              />
            </View>

            <View style={{width: '100%', marginTop: -16}}>
              <InputComponent
                placeholder={t('placeholders.quantity')}
                type="numeric"
                value={quantity}
                onChange={value => {
                  if (value === '') {
                    setQuantity(value);
                  }
                  if (isNumeric(value)) {
                    setQuantity(value);
                  }
                }}
              />
            </View>
          </>
        </View>
      </View>
    </Modal>
  );
};

export default CreateInvoiceOtherItemsModal;
