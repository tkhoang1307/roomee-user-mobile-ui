import React, {useContext, useEffect, useRef, useState} from 'react';
import {View, Platform, Alert, FlatList} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  TouchableOpacityComponent,
  CircleComponent,
  TitleComponent,
  Can,
  SectionComponent,
} from '@components/index';
import {ManageListPaymentMethodScreenProps} from '@models/navigators/HomNavigator';
import {globalStyles} from '@styles';
import {appColors} from '@const/appColors';
import {styles} from './styles';
import {accommodationService, paymentService} from '@services';
import {PaymentMethodModel} from '@models/payment';
import {ErrorResponseAxios} from '@models/error';
import PaymentMethodCard from '@components/payment-method/PaymentMethodCard';
import EditPaymentMethodModal from '../components/EditPaymentMethodModal';
import {AccommodationModel} from '@models/accommodation';
import {AbilityActionEnum, AbilitySubjectEnum} from '@const/abilities';
import EmptyList from '@components/EmptyList';
import ListLoadingMask from '@components/ListLoadingMask';
import {AbilityContext} from '@context';
import {Modalize} from 'react-native-modalize';

const ManageListPaymentMethodScreen: React.FC<
  ManageListPaymentMethodScreenProps
> = ({route, navigation}) => {
  const {t} = useTranslation();
  const {accommodationId} = route.params;
  const ability = useContext(AbilityContext);
  const [editingItem, setEditingItem] = useState<PaymentMethodModel | null>(
    null,
  );
  const [listPaymentMethods, setListPaymentMethods] = useState<
    Array<PaymentMethodModel>
  >([]);
  const [accommodationDetail, setAccommodationDetail] =
    useState<AccommodationModel>();
  const [loading, setLoading] = useState(false);
  const modalizeRef = useRef<Modalize>();

  useEffect(() => {
    const getPayments = async () => {
      try {
        setLoading(true);
        const paymentsRes = await paymentService.getUserPaymentInfors();
        setListPaymentMethods(paymentsRes);
      } catch (error: any) {
        Alert.alert(
          t(`alertTitle.noti`),
          (error as ErrorResponseAxios).response.data.message,
        );
      } finally {
        setLoading(false);
      }
    };
    getPayments();
  }, []);

  useEffect(() => {
    const getDetailAccommodation = async () => {
      try {
        const data = await accommodationService.getDetailAccommodation(
          accommodationId,
        );
        setAccommodationDetail(data);
      } catch (error: any) {
        Alert.alert(
          t(`alertTitle.noti`),
          (error as ErrorResponseAxios).response.data.message,
        );
      }
    };
    getDetailAccommodation();
  }, [accommodationId]);

  const closeRow = (rowMap: any, rowKey: string) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteItem = async (rowMap: any, rowKey: string) => {
    try {
      if (rowKey) {
        await paymentService.deleteUserPaymentInfor(rowKey);
        const newData = [...listPaymentMethods];
        const prevIndex = listPaymentMethods.findIndex(
          item => item.id === rowKey,
        );
        newData.splice(prevIndex, 1);
        setListPaymentMethods(newData);
        closeRow(rowMap, rowKey);
      }
    } catch (error: any) {
      Alert.alert(
        t(`alertTitle.noti`),
        (error as ErrorResponseAxios).response.data.message,
      );
    }
  };

  const onRowOpen = (rowKey: string) => {
    console.log('Opened row with key:', rowKey);
  };

  const openEditModal = (_rowMap: any, rowKey: string) => {
    const prevIndex = listPaymentMethods.findIndex(item => item.id === rowKey);
    setEditingItem(listPaymentMethods[prevIndex]);
    setTimeout(() => {
      modalizeRef.current?.open();
    }, 0);
  };

  const renderItem = ({item}: {item: PaymentMethodModel}) => (
    <PaymentMethodCard detailPaymentMethod={item} />
  );

  const renderHiddenItem = (
    {item}: {item: PaymentMethodModel},
    rowMap: any,
  ) => (
    <View style={styles.hiddenContainer}>
      <TouchableOpacityComponent
        type="primary"
        styles={[styles.hiddenButton, styles.editButton]}
        onPress={() => openEditModal(rowMap, item.id)}
        text={t('actions.edit')}
      />
      <TouchableOpacityComponent
        type="action"
        styles={[styles.hiddenButton, styles.deleteButton]}
        onPress={() => deleteItem(rowMap, item.id)}
        text={t('actions.delete')}
      />
    </View>
  );

  return (
    <View style={[{flex: 1, position: 'relative'}]}>
      <TitleComponent
        back
        title={t('payment.label')}
        titleStyle={{fontSize: 16, marginTop: -2}}
      />
      {loading ? (
        <ListLoadingMask />
      ) : (
        <>
          <Can
            I={AbilityActionEnum.VIEW}
            a={AbilitySubjectEnum.PAYMENT_INFORMATION}>
            <SectionComponent>
              <FlatList
                style={{marginTop: 10}}
                data={accommodationDetail?.owner.UserPaymentMethod}
                renderItem={({item}) => (
                  <PaymentMethodCard detailPaymentMethod={item} />
                )}
                contentContainerStyle={{rowGap: 10}}
                ListEmptyComponent={
                  <EmptyList>{t('label.emptyPaymentMethod')}</EmptyList>
                }
              />
            </SectionComponent>
          </Can>
          {!ability.can(
            AbilityActionEnum.VIEW,
            AbilitySubjectEnum.PAYMENT_INFORMATION,
          ) && (
            <SwipeListView
              data={listPaymentMethods}
              renderItem={renderItem}
              renderHiddenItem={renderHiddenItem}
              leftOpenValue={0}
              rightOpenValue={-150}
              previewRowKey={'0'}
              previewOpenValue={-40}
              previewOpenDelay={3000}
              onRowDidOpen={onRowOpen}
              recalculateHiddenLayout
              style={{marginTop: 10, paddingLeft: 8, paddingRight: 8}}
              contentContainerStyle={{rowGap: 12}}
              ListEmptyComponent={
                <EmptyList>{t('label.emptyPaymentMethod')}</EmptyList>
              }
            />
          )}
        </>
      )}

      <Can
        I={AbilityActionEnum.CREATE}
        a={AbilitySubjectEnum.PAYMENT_INFORMATION}>
        <CircleComponent
          onPress={() => {
            navigation?.navigate('AddPaymentMethodScreen', {});
          }}
          size={55}
          styles={[
            styles.addButton,
            globalStyles.shadow,
            {marginTop: Platform.OS === 'ios' ? -50 : -60},
          ]}>
          <Icon name="plus" size={30} color={appColors.white} />
        </CircleComponent>
      </Can>
      {editingItem && (
        <EditPaymentMethodModal
          selectedPaymentMethod={editingItem}
          setListPaymentMethods={setListPaymentMethods}
          modalizeRef={modalizeRef}
        />
      )}
    </View>
  );
};

export default ManageListPaymentMethodScreen;
