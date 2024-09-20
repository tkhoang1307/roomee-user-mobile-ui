import React, {useContext, useEffect, useState} from 'react';
import {Text, View, Platform, Alert} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import {useTranslation} from 'react-i18next';

import {
  TouchableOpacityComponent,
  CircleComponent,
  TitleComponent,
  Can,
} from '@components/index';
import {ServiceAccommodationScreenProps} from '@models/navigators/HomNavigator';
import {globalStyles} from '@styles';
import {appColors} from '@const/appColors';
import {styles} from './styles';
import {ServiceAccommodationResponseModel} from '@models/service-utility';
import {serviceUtilityServices} from '@services';
import {MONEY_FORMAT_BY} from '@const/index';
import AddServiceAccommodationModal from './components/AddServiceAccommodationModal';
import EditServiceAccommodationModal from './components/EditServiceAccommodationModal';
import RemoveServiceAccommodationConfirmationModal from './components/RemoveServiceAccommodationConfirmationModal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ErrorResponseAxios} from '@models/error';
import ListLoadingMask from '@components/ListLoadingMask';
import EmptyList from '@components/EmptyList';
import {AbilityActionEnum, AbilitySubjectEnum} from '@const/abilities';
import {AbilityContext} from '@context';

const ServiceAccommodationScreen: React.FC<ServiceAccommodationScreenProps> = ({
  route,
}) => {
  const {t} = useTranslation();
  const ability = useContext(AbilityContext);
  const accommodationId = route.params.accommodationID;
  const [accommodationServices, setAccommodationServices] = useState<
    Array<ServiceAccommodationResponseModel>
  >([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);
  const [isOpenRemoveModal, setIsOpenRemoveModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] =
    useState<ServiceAccommodationResponseModel | null>(null);
  const [removingItem, setRemovingItem] =
    useState<ServiceAccommodationResponseModel | null>(null);

  useEffect(() => {
    const getAllSecondaryServicesForAccommodation = async () => {
      try {
        setLoading(true);
        const dataResService =
          await serviceUtilityServices.getAllServicesForAccommodation(
            accommodationId,
            'ALL',
          );
        setAccommodationServices(dataResService);
      } catch (error: any) {
        Alert.alert(
          t(`alertTitle.noti`),
          (error as ErrorResponseAxios).response.data.message,
        );
      } finally {
        setLoading(false);
      }
    };
    getAllSecondaryServicesForAccommodation();
  }, [refreshFlag]);

  const closeRow = (rowMap: any, rowKey: string) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteItem = async (rowMap: any, rowKey: string) => {
    if (rowKey) {
      const prevIndex = accommodationServices.findIndex(
        item => item.id === rowKey,
      );
      setRemovingItem(accommodationServices[prevIndex]);
      setIsOpenRemoveModal(true);
      closeRow(rowMap, rowKey);
    }
  };

  const onRowOpen = (rowKey: string) => {
    console.log('Opened row with key:', rowKey);
  };

  const openEditModal = (rowMap: any, rowKey: string) => {
    const prevIndex = accommodationServices.findIndex(
      item => item.id === rowKey,
    );
    setEditingItem(accommodationServices[prevIndex]);
    setIsOpenEditModal(true);
    closeRow(rowMap, rowKey);
  };

  const handleAddServiceAccommodationModal = () => {
    setIsOpenAddModal(true);
  };

  const renderItem = ({item}: {item: ServiceAccommodationResponseModel}) => (
    <View style={[styles.itemContainer]}>
      <Text style={styles.itemText}>{t(`service.${item.name}.name`)}</Text>
      <Text style={styles.itemTitle}>
        {item.cost.toString().replace(MONEY_FORMAT_BY, ',')} /{' '}
        {t(`service.${item.name}.unit.${item.unit}`)}
      </Text>
    </View>
  );

  const renderHiddenItem = (
    {item}: {item: ServiceAccommodationResponseModel},
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
        title={t(`pageTitle.listServices`)}
        titleStyle={{fontSize: 20, marginTop: -2}}
      />
      <View style={[styles.container]}>
        {loading ? (
          <ListLoadingMask />
        ) : (
          <SwipeListView
            data={accommodationServices}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            leftOpenValue={0}
            rightOpenValue={-150}
            previewRowKey={'0'}
            previewOpenValue={-40}
            previewOpenDelay={3000}
            onRowDidOpen={onRowOpen}
            onRefresh={() => setRefreshFlag(prev => !prev)}
            ListEmptyComponent={
              <EmptyList>{t('label.emptyServices')}</EmptyList>
            }
            refreshing={loading && accommodationServices.length === 0}
            style={{marginTop: 10}}
            contentContainerStyle={{
              height: '100%',
            }}
            disableLeftSwipe={
              !ability.can(
                AbilityActionEnum.EDIT,
                AbilitySubjectEnum.ACCOMMODATION_SERVICE,
              )
            }
          />
        )}
      </View>
      {editingItem && (
        <EditServiceAccommodationModal
          selectedService={editingItem}
          setAccommodationServices={setAccommodationServices}
          isOpenEditModal={isOpenEditModal}
          setIsOpenEditModal={setIsOpenEditModal}
        />
      )}
      {removingItem && (
        <RemoveServiceAccommodationConfirmationModal
          accommodationId={accommodationId}
          selectedService={removingItem}
          accommodationServices={accommodationServices}
          setAccommodationServices={setAccommodationServices}
          modalOpenRemove={isOpenRemoveModal}
          setModalOpenRemove={setIsOpenRemoveModal}
        />
      )}
      <AddServiceAccommodationModal
        accommoadationId={accommodationId}
        accommodationServices={accommodationServices}
        setAccommodationServices={setAccommodationServices}
        isOpenAddModal={isOpenAddModal}
        setIsOpenAddModal={setIsOpenAddModal}
      />
      <Can
        I={AbilityActionEnum.EDIT}
        a={AbilitySubjectEnum.ACCOMMODATION_SERVICE}>
        <CircleComponent
          onPress={handleAddServiceAccommodationModal}
          size={55}
          styles={[
            styles.addButton,
            globalStyles.shadow,
            {marginTop: Platform.OS === 'ios' ? -50 : -60},
          ]}>
          <Icon name="plus" size={30} color={appColors.white} />
        </CircleComponent>
      </Can>
    </View>
  );
};

export default ServiceAccommodationScreen;
