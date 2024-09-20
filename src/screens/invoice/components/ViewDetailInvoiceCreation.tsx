import {useTranslation} from 'react-i18next';
import {useMemo, useState} from 'react';
import {View} from 'react-native';

import TextComponent from '@components/TextComponent';
import {CreationInvoiceItemModel, CreationInvoiceItemPropertyModel} from '@models/invoices';
import {styles} from '../styles';
import {MONEY_FORMAT_BY} from '@const/index';
import ViewDetailInvoiceServiceItemsCreation from './ViewDetailInvoiceServiceItemsCreation';
import ViewDetailInvoiceOtherItemsCreation from './ViewDetailInvoiceOtherItemsCreation';
import CreateInvoiceItemModal from './CreateInvoiceItemModal';
import CreateInvoiceOtherItemsModal from './CreateInvoiceOtherItemsModal';
import { Button } from '@ant-design/react-native';

interface ViewDetailInvoiceCreationProps {
  roomId: string;
  serviceInvoiceItems: CreationInvoiceItemModel[];
  setServiceInvoiceItems: React.Dispatch<
    React.SetStateAction<CreationInvoiceItemModel[]>
  >;
  initialWater: number;
  initialElectric: number;
  propertyInvoiceItems: CreationInvoiceItemPropertyModel[];
  setPropertyInvoiceItems: React.Dispatch<
    React.SetStateAction<CreationInvoiceItemPropertyModel[]>
  >;
  mode?: string;
}

const ViewDetailInvoiceCreation: React.FC<ViewDetailInvoiceCreationProps> = ({
  roomId,
  serviceInvoiceItems,
  setServiceInvoiceItems,
  initialWater,
  initialElectric,
  propertyInvoiceItems,
  setPropertyInvoiceItems,
  mode
}) => {
  const {t} = useTranslation();
  const [modalOpenServiceItems, setModalOpenServiceItems] = useState<boolean>(false);
  const [modalOpenOtherItems, setModalOpenOtherItems] = useState<boolean>(false);

  const totalInvoiceService = useMemo(() => {
    return serviceInvoiceItems.reduce(
      (total, item) => total + item?.cost * item.quantity,
      0
    );
  }, [serviceInvoiceItems]);

  const totalInvoiceOtherItems = useMemo(() => {
    return propertyInvoiceItems.reduce(
      (total, item) => total + item.cost * item.quantity,
      0
    );
  }, [propertyInvoiceItems]);

  const totalInvoice = useMemo(() => {
    return serviceInvoiceItems.reduce(
      (total, item) => total + item.cost * item.quantity,
      0
    ) + propertyInvoiceItems.reduce(
      (total, item) => total + item.cost * item.quantity,
      0
    );
  }, [serviceInvoiceItems, propertyInvoiceItems]);


  return (
    <View
      style={{
        width: '100%',
        rowGap: 1,
      }}>
      {serviceInvoiceItems.length > 0 && (
        <ViewDetailInvoiceServiceItemsCreation
          serviceInvoiceItems={serviceInvoiceItems}
          setServiceInvoiceItems={setServiceInvoiceItems}
          initialWater={initialWater}
          initialElectric={initialElectric}
          mode={mode}
        />
      )}
      {propertyInvoiceItems.length > 0 && (
        <ViewDetailInvoiceOtherItemsCreation
          propertyInvoiceItems={propertyInvoiceItems}
          setPropertyInvoiceItems={setPropertyInvoiceItems}
        />
      )}
      <View style={styles.contentInvoice}>
        <View style={styles.contentInvoiceItemCenter}>
          <Button type="ghost"  onPress={() => setModalOpenServiceItems(true)}>
            {t('actions.addInvoiceItem')}
          </Button>
        </View>
        <View style={styles.contentInvoiceItemCenter}>
          <Button type="ghost"  onPress={() => setModalOpenOtherItems(true)}>
            {t('invoiceItem.repairCost.actions.add')}
          </Button>
        </View>
      </View>
      <View style={styles.line} />
      <View>
        <View style={styles.contentInvoice}>
          <View style={styles.contentInvoiceItemFlex3}>
            <TextComponent styles={[styles.itemText]} size={30}>
              {t('invoiceItem.service.totalAmount')}:
            </TextComponent>
          </View>
          <View style={styles.contentInvoiceItemFlex2}>
            <TextComponent styles={[styles.itemTitle]} size={30}>
              {`${totalInvoiceService}`.replace(MONEY_FORMAT_BY, ',')}
            </TextComponent>
          </View>
        </View>
        <View style={styles.contentInvoice}>
          <View style={styles.contentInvoiceItemFlex3}>
            <TextComponent styles={[styles.itemText]} size={30}>
              {t('invoiceItem.repairCost.totalAmount')}:
            </TextComponent>
          </View>
          <View style={styles.contentInvoiceItemFlex2}>
            <TextComponent styles={[styles.itemTitle]} size={30}>
              {`${totalInvoiceOtherItems}`.replace(MONEY_FORMAT_BY, ',')}
            </TextComponent>
          </View>
        </View>
        <View style={styles.contentInvoice}>
          <View style={styles.contentInvoiceItemFlex3}>
            <TextComponent styles={[styles.itemText]} size={30}>
              {t('invoice.subTotal')}:
            </TextComponent>
          </View>
          <View style={styles.contentInvoiceItemFlex2}>
            <TextComponent styles={[styles.itemTitle]} size={30}>
              {`${totalInvoice}`.replace(MONEY_FORMAT_BY, ',')}
            </TextComponent>
          </View>
        </View>
      </View>

      <CreateInvoiceItemModal
        roomId={roomId}
        modalOpen={modalOpenServiceItems}
        setModalOpen={setModalOpenServiceItems}
        serviceInvoiceItems={serviceInvoiceItems}
        setServiceInvoiceItems={setServiceInvoiceItems}
      />
      <CreateInvoiceOtherItemsModal
        modalOpen={modalOpenOtherItems}
        setModalOpen={setModalOpenOtherItems}
        propertyInvoiceItems={propertyInvoiceItems}
        setPropertyInvoiceItems={setPropertyInvoiceItems}
      />
    </View>
  );
};

export default ViewDetailInvoiceCreation;
