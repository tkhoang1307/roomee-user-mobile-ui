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
import {ListRulesScreenProps} from '@models/navigators/HomNavigator';
import {globalStyles} from '@styles';
import {appColors} from '@const/appColors';
import {styles} from './styles';
import {ErrorResponseAxios} from '@models/error';
import {DetailRuleModel} from '@models/rule';
import {ruleService} from '@services';
import {formatDatetimeToHHMMSSDDMMYYYY} from '@utils/convertDateFormat';
import AddRuleModal from './components/AddRuleModal';
import EditRuleModal from './components/EditRuleModal';
import ApplySwitchButton from './components/ApplySwitchButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ListLoadingMask from '@components/ListLoadingMask';
import EmptyList from '@components/EmptyList';
import {AbilityActionEnum, AbilitySubjectEnum} from '@const/abilities';
import {AbilityContext} from '@context';

const ListRulesScreen: React.FC<ListRulesScreenProps> = ({route}) => {
  const {t} = useTranslation();
  const ability = useContext(AbilityContext);
  const accommodationId = route.params.accommodationID;
  const [loading, setLoading] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [listRules, setListRules] = useState<DetailRuleModel[]>([]);
  const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<DetailRuleModel | null>(null);

  useEffect(() => {
    const getAllRulesOfAccommodation = async () => {
      try {
        setLoading(true);
        const resData = await ruleService.getAllRulesOfAccommodation(
          accommodationId || '',
        );
        const dataRules = resData.map(item => ({...item, key: item.id}));

        setListRules(dataRules);
      } catch (error) {
        Alert.alert(
          t(`alertTitle.noti`),
          (error as ErrorResponseAxios).response.data.message,
        );
      } finally {
        setLoading(false);
      }
    };
    getAllRulesOfAccommodation();
  }, [refreshFlag]);

  const onRowOpen = (rowKey: string) => {
    console.log('Opened row with key:', rowKey);
  };

  const openEditModal = (rowKey: string) => {
    const prevIndex = listRules.findIndex(item => item.id === rowKey);
    setEditingItem(listRules[prevIndex]);
    setIsOpenEditModal(true);
  };

  const handleAddRuleModal = () => {
    setIsOpenAddModal(true);
  };

  const renderItem = ({item}: {item: DetailRuleModel}) => (
    <View style={[styles.itemContainer]}>
      <Text style={styles.itemTitle}>{item.description}</Text>
      <View style={styles.subItemContainer}>
        <View style={styles.leftContainer}>
          <Text style={styles.itemText}>{item.updater.name}</Text>
          <Text style={styles.itemText}>
            {formatDatetimeToHHMMSSDDMMYYYY(item.updatedAt, false)}
          </Text>
        </View>
        <View style={styles.centerContainer}>
          <ApplySwitchButton
            accommodationId={accommodationId}
            rule={item}
            setListRules={setListRules}
            disable={
              !ability.can(AbilityActionEnum.EDIT, AbilitySubjectEnum.RULE)
            }
          />
        </View>
      </View>
    </View>
  );

  const renderHiddenItem = ({item}: {item: DetailRuleModel}) => (
    <View style={styles.hiddenContainer}>
      <TouchableOpacityComponent
        type="primary"
        styles={[styles.hiddenButton, styles.editButton]}
        onPress={() => openEditModal(item.id)}
        text={t('actions.edit')}
      />
    </View>
  );

  return (
    <View style={[{flex: 1, position: 'relative'}]}>
      <TitleComponent
        back
        title={t(`pageTitle.listRules`)}
        titleStyle={{fontSize: 16}}
      />
      <View style={[styles.container]}>
        {loading ? (
          <ListLoadingMask />
        ) : (
          <SwipeListView
            data={listRules}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            leftOpenValue={0}
            rightOpenValue={-75}
            previewRowKey={'0'}
            previewOpenValue={-40}
            previewOpenDelay={3000}
            onRowDidOpen={onRowOpen}
            onRefresh={() => setRefreshFlag(prev => !prev)}
            ListEmptyComponent={<EmptyList>{t('label.emptyRule')}</EmptyList>}
            refreshing={loading && listRules.length === 0}
            style={{
              marginTop: 16,
            }}
            recalculateHiddenLayout
            contentContainerStyle={{
              height: '100%',
            }}
            disableLeftSwipe={
              !ability.can(AbilityActionEnum.EDIT, AbilitySubjectEnum.RULE)
            }
          />
        )}
      </View>
      {editingItem && (
        <EditRuleModal
          accommodationId={accommodationId}
          rule={editingItem}
          setListRules={setListRules}
          isOpenEditModal={isOpenEditModal}
          setIsOpenEditModal={setIsOpenEditModal}
        />
      )}
      <AddRuleModal
        accommoadationId={accommodationId}
        listRules={listRules}
        setListRules={setListRules}
        isOpenAddModal={isOpenAddModal}
        setIsOpenAddModal={setIsOpenAddModal}
      />
      <Can I={AbilityActionEnum.EDIT} a={AbilitySubjectEnum.RULE}>
        <CircleComponent
          onPress={handleAddRuleModal}
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

export default ListRulesScreen;
