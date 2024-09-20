import {useTranslation} from 'react-i18next';
import {useEffect, useState} from 'react';
import {Button} from '@ant-design/react-native';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {appColors} from '@const/appColors';
import TextComponent from '@components/TextComponent';
import {CreationInvoiceItemModel} from '@models/invoices';
import {styles} from '../styles';
import {MONEY_FORMAT_BY} from '@const/index';
import InputComponent from '@components/InputComponent';
import {isNumeric} from '@utils/accommodation';

interface ViewDetailInvoiceServiceItemsCreationProps {
  serviceInvoiceItems: CreationInvoiceItemModel[];
  setServiceInvoiceItems: React.Dispatch<
    React.SetStateAction<CreationInvoiceItemModel[]>
  >;
  initialWater: number;
  initialElectric: number;
  mode?: string;
}

const ViewDetailInvoiceServiceItemsCreation: React.FC<ViewDetailInvoiceServiceItemsCreationProps> = ({
  serviceInvoiceItems,
  setServiceInvoiceItems,
  initialWater,
  initialElectric,
  mode
}) => {
  const {t} = useTranslation();
  const [oldIndicatorElectric, setOldIndicatorElectric] = useState<number>(0);
  const [newIndicatorElectric, setNewIndicatorElectric] = useState<number>(0);
  const [oldIndicatorWaterM3, setOldIndicatorWaterM3] = useState<number>(0);
  const [newIndicatorWaterM3, setNewIndicatorWaterM3] = useState<number>(0);

  useEffect(() => {
    const getInitialData = () => {
      serviceInvoiceItems.map(service => {
        if (service.name === 'electric') {
          setOldIndicatorElectric(service.meta?.oldIndicator || 0);
          setNewIndicatorElectric(service.meta?.newIndicator || 0);
        }
        if (service.name === 'water' && service.unit === 'm3') {
          setOldIndicatorWaterM3(service.meta?.oldIndicator || 0);
          setNewIndicatorWaterM3(service.meta?.newIndicator || 0);
        }
      });
    };
    getInitialData();
  }, [serviceInvoiceItems]);

  useEffect(() => {
    if (initialWater > 0 && mode === 'create') {
      setOldIndicatorWaterM3(initialWater);
      setNewIndicatorWaterM3(initialWater + 1);
      setServiceInvoiceItems(prev =>
        prev.map(i => {
          if (i.name === 'water') {
            return {
              ...i,
              meta: {
                newIndicator: initialWater + 1,
                oldIndicator: initialWater,
              },
              quantity: 1,
            };
          }
          return i;
        }),
      );
    }
  }, [initialWater]);

  useEffect(() => {
    if (initialElectric > 0 && mode === 'create') {
      setOldIndicatorElectric(initialElectric);
      setNewIndicatorElectric(initialElectric + 1);
      setServiceInvoiceItems(prev =>
        prev.map(i => {
          if (i.name === 'electric') {
            return {
              ...i,
              meta: {
                newIndicator: initialElectric + 1,
                oldIndicator: initialElectric,
              },
              quantity: 1,
            };
          }
          return i;
        }),
      );
    }
  }, [initialElectric]);

  const handleQuantityChange = async (
    roomTenantServiceId: string,
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
    const updatedServiceInvoiceItems = serviceInvoiceItems.map(item =>
      item.roomTenantServiceId === roomTenantServiceId
        ? {...item, quantity: quantity}
        : item,
    );
    setServiceInvoiceItems(updatedServiceInvoiceItems);
  };

  const handleRemoveInvoiceItem = (roomTenantServiceId: string) => {
    const updatedServiceInvoiceItems = serviceInvoiceItems.filter(
      item => item.roomTenantServiceId !== roomTenantServiceId,
    );
    setServiceInvoiceItems(updatedServiceInvoiceItems);
  };

  const handleChangeOldIndicatorElectric = (
    roomTenantServiceId: string,
    value: string | '',
  ) => {
    let quantity = 0;
    if (value === '') {
      quantity = 0;
    } else {
      if (isNumeric(value)) {
        quantity = parseInt(value);
      }
    }

    if (value !== null) {
      setOldIndicatorElectric(quantity);
      const updatedServiceInvoiceItems = serviceInvoiceItems.map(item =>
        item.roomTenantServiceId === roomTenantServiceId
          ? {
              ...item,
              meta: {
                ...item.meta,
                oldIndicator: quantity,
              },
              quantity: newIndicatorElectric - quantity,
            }
          : item,
      );

      setServiceInvoiceItems(updatedServiceInvoiceItems);
    }
  };
  const handleChangeNewIndicatorElectric = (
    roomTenantServiceId: string,
    value: string | '',
  ) => {
    let quantity = 0;
    if (value === '') {
      quantity = 0;
    } else {
      if (isNumeric(value)) {
        quantity = parseInt(value);
      }
    }

    if (value !== null) {
      setNewIndicatorElectric(quantity);
      const updatedServiceInvoiceItems = serviceInvoiceItems.map(item =>
        item.roomTenantServiceId === roomTenantServiceId
          ? {
              ...item,
              meta: {
                ...item.meta,
                newIndicator: quantity,
              },
              quantity: quantity - oldIndicatorElectric,
            }
          : item,
      );

      setServiceInvoiceItems(updatedServiceInvoiceItems);
    }
  };

  const handleChangeOldIndicatorWaterM3 = (
    roomTenantServiceId: string,
    value: string | '',
  ) => {
    let quantity = 0;
    if (value === '') {
      quantity = 0;
    } else {
      if (isNumeric(value)) {
        quantity = parseInt(value);
      }
    }

    if (value !== null) {
      setOldIndicatorWaterM3(quantity);
      const updatedServiceInvoiceItems = serviceInvoiceItems.map(item =>
        item.roomTenantServiceId === roomTenantServiceId
          ? {
              ...item,
              meta: {
                ...item.meta,
                oldIndicator: quantity,
              },
              quantity: newIndicatorWaterM3 - quantity,
            }
          : item,
      );

      setServiceInvoiceItems(updatedServiceInvoiceItems);
    }
  };
  const handleChangeNewIndicatorWaterM3 = (
    roomTenantServiceId: string,
    value: string | '',
  ) => {
    let quantity = 0;
    if (value === '') {
      quantity = 0;
    } else {
      if (isNumeric(value)) {
        quantity = parseInt(value);
      }
    }

    if (value !== null) {
      setNewIndicatorWaterM3(quantity);
      const updatedServiceInvoiceItems = serviceInvoiceItems.map(item =>
        item.roomTenantServiceId === roomTenantServiceId
          ? {
              ...item,
              meta: {
                ...item.meta,
                newIndicator: quantity,
              },
              quantity: quantity - oldIndicatorWaterM3,
            }
          : item,
      );

      setServiceInvoiceItems(updatedServiceInvoiceItems);
    }
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
            {t('invoiceItem.service.title')}
          </TextComponent>
        </View>
      </View>
      <View>
        {serviceInvoiceItems?.map((item, index) => (
          <View key={index}>
            <View style={styles.lineContent} />
            <View style={[styles.contentInvoice, {marginBottom: -4}]}>
              <View style={[styles.contentInvoiceItemLeft, {flex: 7.5}]}>
                <TextComponent styles={styles.itemTitle}>
                  {t(`service.${item.name}.name`)}:{'  '}
                </TextComponent>
                <TextComponent styles={styles.itemText}>
                  {`${item.cost}`.replace(MONEY_FORMAT_BY, ',')}/
                  {t(`service.${item.name}.unit.${item.unit}`)}
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
                      handleRemoveInvoiceItem(item.roomTenantServiceId)
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
            {item.name === 'electric' ? (
              <View>
                <View style={[styles.contentInvoice, {marginBottom: -4}]}>
                  <View
                    style={[
                      styles.contentInvoiceItemLeft,
                      {flex: 1, marginRight: 8},
                    ]}>
                    <TextComponent styles={styles.itemText}>
                      {t('placeholders.oldIndicator')}
                    </TextComponent>
                  </View>
                  <View
                    style={[
                      styles.contentInvoiceItemLeft,
                      {flex: 1, marginLeft: 8},
                    ]}>
                    <TextComponent styles={styles.itemText}>
                      {t('placeholders.newIndicator')}
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
                        oldIndicatorElectric.toString() == '0'
                          ? ''
                          : oldIndicatorElectric.toString()
                      }
                      onChange={val => {
                        handleChangeOldIndicatorElectric(
                          item.roomTenantServiceId,
                          val,
                        );
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
                        newIndicatorElectric.toString() == '0'
                          ? ''
                          : newIndicatorElectric.toString()
                      }
                      onChange={val => {
                        handleChangeNewIndicatorElectric(
                          item.roomTenantServiceId,
                          val,
                        );
                      }}
                      styleInput={{marginBottom: 4}}
                    />
                  </View>
                </View>
                <View style={styles.contentInvoice}>
                  <View style={[styles.contentInvoiceItemLeft]}>
                    <TextComponent styles={styles.itemTitle}>
                      {t('placeholders.consumptionVolume')}:
                    </TextComponent>
                  </View>
                  <View style={[styles.contentInvoiceItemRight]}>
                    <TextComponent styles={styles.itemText}>
                      {item.quantity}{' '}
                      {t(`service.${item.name}.unit.${item.unit}`)}
                    </TextComponent>
                  </View>
                </View>
              </View>
            ) : item.name === 'water' && item.unit === 'm3' ? (
              <View>
                <View style={[styles.contentInvoice, {marginBottom: -4}]}>
                  <View
                    style={[
                      styles.contentInvoiceItemLeft,
                      {flex: 1, marginRight: 8},
                    ]}>
                    <TextComponent styles={styles.itemText}>
                      {t('placeholders.oldIndicator')}
                    </TextComponent>
                  </View>
                  <View
                    style={[
                      styles.contentInvoiceItemLeft,
                      {flex: 1, marginLeft: 8},
                    ]}>
                    <TextComponent styles={styles.itemText}>
                      {t('placeholders.newIndicator')}
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
                        oldIndicatorWaterM3.toString() == '0'
                          ? ''
                          : oldIndicatorWaterM3.toString()
                      }
                      onChange={val => {
                        handleChangeOldIndicatorWaterM3(
                          item.roomTenantServiceId,
                          val,
                        );
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
                        newIndicatorWaterM3.toString() == '0'
                          ? ''
                          : newIndicatorWaterM3.toString()
                      }
                      onChange={val => {
                        handleChangeNewIndicatorWaterM3(
                          item.roomTenantServiceId,
                          val,
                        );
                      }}
                      styleInput={{marginBottom: 4}}
                    />
                  </View>
                </View>
                <View style={styles.contentInvoice}>
                  <View style={[styles.contentInvoiceItemLeft]}>
                    <TextComponent styles={styles.itemTitle}>
                      {t('placeholders.consumptionVolume')}:
                    </TextComponent>
                  </View>
                  <View style={[styles.contentInvoiceItemRight]}>
                    <TextComponent styles={styles.itemText}>
                      {item.quantity}{' '}
                      {t(`service.${item.name}.unit.${item.unit}`)}
                    </TextComponent>
                  </View>
                </View>
              </View>
            ) : (
              <View>
                <View style={[styles.contentInvoice, {marginBottom: -4}]}>
                  <View style={[styles.contentInvoiceItemLeft, {flex: 1}]}>
                    <TextComponent styles={styles.itemText}>
                      {t('label.quantity')}
                    </TextComponent>
                  </View>
                </View>
                <View style={[styles.contentInvoice, {marginBottom: 8}]}>
                  <View style={[styles.contentInvoiceItemLeft, {flex: 5}]}>
                    <InputComponent
                      type="numeric"
                      value={
                        item.quantity.toString() == '0'
                          ? ''
                          : item.quantity.toString()
                      }
                      onChange={val => {
                        handleQuantityChange(item.roomTenantServiceId, val);
                      }}
                      suffix={
                        <TextComponent>
                          {t(`service.${item.name}.unit.${item.unit}`)}
                        </TextComponent>
                      }
                      styleInput={{marginBottom: 4}}
                    />
                  </View>
                </View>
              </View>
            )}

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

export default ViewDetailInvoiceServiceItemsCreation;
