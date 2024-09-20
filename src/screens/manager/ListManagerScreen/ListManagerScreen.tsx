import {ActivityIndicator, Alert, FlatList, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  CircleComponent,
  SectionComponent,
  TitleComponent,
} from '@components/index';
import {globalStyles} from '@styles';
import {ownerService} from '@services';
import usePagination from '@hk/usePanigation';
import {UserDetailModel} from '@models/user';
import {appColors} from '@const/appColors';
import ManagerCard from './components/ManagerCard';

const ListManagerScreen = ({navigation}: any) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [managers, setManagers] = useState<UserDetailModel[]>([]);

  const fetchFunction = async (page: number) => {
    try {
      const resData = await ownerService.getAllManagersByOwner(page);
      const dataManagers = resData.managers.map(item => {
        return {...item, key: item.id};
      });
      setManagers(prevManagers => [...prevManagers, ...dataManagers]);
    } catch (error: any) {}
  };
  const initialPage = 1;
  const {handleEndReached} = usePagination({
    fetchFunction,
    totalPage,
    initialPage,
  });

  useEffect(() => {
    const getAllManagers = async () => {
      try {
        const resData = await ownerService.getAllManagersByOwner(page);
        const dataManagers = resData.managers.map(item => {
          return {...item, key: item.id};
        });
        setManagers(dataManagers);
        setTotalPage(resData.total);
      } catch (error: any) {
        Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
          {
            text: t('actions.cancel'),
            style: 'cancel',
          },
        ]);
      } finally {
        setLoading(true);
      }
    };
    getAllManagers();
  }, []);

  return (
    <View style={[globalStyles.container, {position: 'relative'}]}>
      <TitleComponent
        back
        title={t('pageTitle.listManagers')}
        titleStyle={{fontSize: 20, marginTop: -2}}
      />
      <SectionComponent>
        {loading && (
          <FlatList
            data={managers}
            renderItem={({item}) => (
              <ManagerCard managerInfor={item} setManagers={setManagers} />
            )}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              loadingMore ? <ActivityIndicator size="large" /> : null
            }
          />
        )}
      </SectionComponent>
      <View style={{position: 'absolute', bottom: 20, right: 20}}>
        <CircleComponent
          onPress={() => {
            navigation.navigate('CreateManagerAccountScreen');
          }}
          size={55}>
          <Icon name="plus" size={30} color={appColors.white} />
        </CircleComponent>
      </View>
    </View>
  );
};

export default ListManagerScreen;
