import {useTranslation} from 'react-i18next';
import {Button} from '@ant-design/react-native';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {appColors} from '@const/appColors';
import TextComponent from '@components/TextComponent';
import {CreationInvoiceItemPropertyModel} from '@models/invoices';
import {styles} from '../styles';
import {MONEY_FORMAT_BY} from '@const/index';
import InputComponent from '@components/InputComponent';
import {isNumeric} from '@utils/accommodation';

interface ViewDetailInvoiceOtherItemsCreationProps {
  propertyInvoiceItems: CreationInvoiceItemPropertyModel[];
  setPropertyInvoiceItems: React.Dispatch<
    React.SetStateAction<CreationInvoiceItemPropertyModel[]>
  >;
}

const ViewDetailInvoiceOtherItemsCreation: React.FC<ViewDetailInvoiceOtherItemsCreationProps> = ({
  propertyInvoiceItems,
  setPropertyInvoiceItems,
}) => {
  const {t} = useTranslation();

  const handleQuantityChange = (
    roomTenantPropertyId: string,
    newQuantity: string | '',
  ) => {
    let quantity = 0;
    if (newQuantity === '') {
      quantity = 0;
    } else {
      if (isNumeric(newQuantity)) {
        quantity = parseInt(newQuantity);
      }
    }
    const updatedPropertyInvoiceItems = propertyInvoiceItems.map(item =>
      item.roomTenantPropertyId === roomTenantPropertyId
        ? {...item, quantity: quantity}
        : item,
    );
    setPropertyInvoiceItems(updatedPropertyInvoiceItems);
  };

  const handleCostChange = (
    roomTenantPropertyId: string,
    newCost: string | '',
  ) => {
    let cost = 0;
    if (newCost === '') {
      cost = 0;
    } else {
      if (isNumeric(newCost)) {
        cost = parseInt(newCost);
      }
    }
    const updatedPropertyInvoiceItems = propertyInvoiceItems.map(item =>
      item.roomTenantPropertyId === roomTenantPropertyId
        ? {...item, cost: cost}
        : item,
    );
    setPropertyInvoiceItems(updatedPropertyInvoiceItems);
  };

  const handleRemoveInvoiceItem = (roomTenantPropertyId: string) => {
    const updatedPropertyInvoiceItems = propertyInvoiceItems.filter(
      (item) => item.roomTenantPropertyId !== roomTenantPropertyId
    );
    setPropertyInvoiceItems(updatedPropertyInvoiceItems);
  };

  return (
    <View
      style={{
        width: '100%',
        rowGap: 1,
      }}>
      <View style={[styles.headerInvoice]}>
        <View style={styles.headerInvoiceItemCenter}>
          <TextComponent styles={[styles.itemTitle, {fontSize: 22}]}>
            {t('invoiceItem.repairCost.title')}
          </TextComponent>
        </View>
      </View>
      <View>
        {propertyInvoiceItems?.map((item, index) => (
          <View key={index}>
            <View style={styles.lineContent} />
            <View style={[styles.contentInvoice, {marginBottom: -4}]}>
              <View style={[styles.contentInvoiceItemLeft, {flex: 7.5}]}>
                <TextComponent styles={styles.itemTitle}>
                  {item.name}
                </TextComponent>
              </View>
              <View style={[styles.contentInvoiceItemRight, {flex: 2.5}]}>
                <View
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}>
                  <Button
                    style={{borderColor: 'white', padding: 0}}
                    onPress={() =>
                      handleRemoveInvoiceItem(item.roomTenantPropertyId)
                    }>
                    <Icon
                      name="delete-outline"
                      size={26}
                      style={{color: appColors.danger}}
                    />
                  </Button>
                </View>
              </View>
            </View>
            <View>
              <View style={[styles.contentInvoice, {marginBottom: -4}]}>
                <View
                  style={[
                    styles.contentInvoiceItemLeft,
                    {flex: 1, marginRight: 8},
                  ]}>
                  <TextComponent styles={styles.itemText}>
                    {t('placeholders.cost')}
                  </TextComponent>
                </View>
                <View
                  style={[
                    styles.contentInvoiceItemLeft,
                    {flex: 1, marginLeft: 8},
                  ]}>
                  <TextComponent styles={styles.itemText}>
                    {t('placeholders.quantity')}
                  </TextComponent>
                </View>
              </View>
              <View style={[styles.contentInvoice, {marginBottom: 8}]}>
                <View
                  style={[
                    styles.contentInvoiceItemLeft,
                    {flex: 1, marginRight: 8},
                  ]}>
                  <InputComponent
                    type="numeric"
                    value={
                      item.cost.toString() == '0'
                        ? ''
                        : item.cost.toString()
                    }
                    onChange={val => {
                      handleCostChange(item.roomTenantPropertyId, val);
                    }}
                    styleInput={{marginBottom: 4}}
                  />
                </View>
                <View
                  style={[
                    styles.contentInvoiceItemLeft,
                    {flex: 1, marginLeft: 8},
                  ]}>
                  <InputComponent
                    type="numeric"
                    value={
                      item.quantity.toString() == '0'
                        ? ''
                        : item.quantity.toString()
                    }
                    onChange={val => {
                      handleQuantityChange(item.roomTenantPropertyId, val);
                    }}
                    styleInput={{marginBottom: 4}}
                  />
                </View>
              </View>
            </View>

            <View style={styles.contentInvoice}>
              <View style={[styles.contentInvoiceItemLeft]}>
                <TextComponent styles={styles.itemTitle}>
                  {t('label.amount')}:
                </TextComponent>
              </View>
              <View style={[styles.contentInvoiceItemRight]}>
                <TextComponent styles={styles.itemText}>
                  {`${item.cost * item.quantity}`.replace(MONEY_FORMAT_BY, ',')}
                </TextComponent>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default ViewDetailInvoiceOtherItemsCreation;
