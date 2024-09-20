import {ActivityIndicator, Alert, FlatList, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import React, {useEffect, useState} from 'react';
import RNFetchBlob, {RNFetchBlobConfig} from 'rn-fetch-blob';

import {ListTenantScreenProps} from '@models/navigators/HomNavigator';
import {ButtonComponent, TitleComponent} from '@components/index';
import {globalStyles} from '@styles';
import {accommodationService, tenantService} from '@services';
import TenantCardComponent from './components/TenantCardComponent';
import {TenantCardInformationModel} from '@models/tenant';
import {REGISTRATION_TEMPLATE_TYPE_NAME} from '@const/accomodation';
import {appColors} from '@const/appColors';

const ListTenantScreen: React.FC<ListTenantScreenProps> = ({route}) => {
  const {accommodationID} = route.params;
  const {t} = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [items, setItems] = useState<TenantCardInformationModel[]>([]);

  const handleDownload = async () => {
    setLoadingDownload(true);
    try {
      const data = await accommodationService.getRegistrationTemplate(
        accommodationID,
        REGISTRATION_TEMPLATE_TYPE_NAME,
      );
      const templateUrl = data[0].settings.templateUrl;
      const {config, fs} = RNFetchBlob;
      let DownloadDir = fs.dirs.DownloadDir; // You can choose any directory you prefer

      let options: RNFetchBlobConfig = {
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
          notification: true,
          path: DownloadDir + '/Mau-don-xin-xac-nhan-tam-tru.pdf', // Download path
          description: t('descriptions.downloadFile'),
        },
      };

      config(options)
        .fetch('GET', templateUrl)
        .then(_res => {
          // do some magic here by Luat Huynh :))
          //console.log('File downloaded to:', res.path());
        })
        .catch(error => {
          console.error('Download file err', error);
        });
      setLoadingDownload(false);
      Alert.alert(t('alertTitle.noti'), t('success.downloadFile'), [
        {
          text: t('actions.cancel'),
          style: 'cancel',
        },
      ]);
    } catch (error: any) {
      Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
        {
          text: t('actions.cancel'),
          style: 'cancel',
        },
      ]);
    } finally {
      setLoadingDownload(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const getAllTenant = async () => {
      if (!hasMore) return;
      try {
        const resData = await tenantService.getAllTenantsOfAccommodation(
          accommodationID,
          page,
        );
        const dataTenants = resData.data.tenants.map(
          ({identityCards, ...payload}) => {
            const identityCard = identityCards?.find(
              id => id.isLatestIdentityCard === true,
            );
            return {
              ...payload,
              name: identityCard?.name || '',
              gender: identityCard?.gender || '',
              key: payload.id,
              roomName: payload.rooms[0].name,
            };
          },
        );
        setItems(prevItems => [...prevItems, ...dataTenants]);
        if (page === resData.totalPage) setHasMore(false);
        else {
          setHasMore(true);
        }
      } catch (error: any) {
        Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
          {
            text: t('actions.cancel'),
            style: 'cancel',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    getAllTenant();
  }, [page]);

  return (
    <View style={[globalStyles.container, {position: 'relative'}]}>
      <TitleComponent
        back
        title={t('screensTitle.tenantTitle')}
        titleStyle={{fontSize: 20, marginTop: -2}}
      />
      <View
        style={{
          width: '100%',
          alignItems: 'flex-end',
          paddingRight: 10,
        }}>
        <ButtonComponent
          text={t('label.downloadRegistrationTemplate')}
          type="primary"
          styles={{width: 250, marginTop: 10}}
          onPress={handleDownload}
          loading={loadingDownload}
        />
      </View>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TenantCardComponent
            roomName={item.roomName}
            gender={item.gender}
            name={item.name}
            key={item.id}
            phone={item.phoneNumber}
            startDate={item.temporaryResidenceRegistrationStartDate}
            endDate={item.temporaryResidenceRegistrationEndDate}
            status={item.userId === null ? false : true}
            styles={{marginTop: 10}}
          />
        )}
        onEndReached={() => setPage(page + 1)}
        onEndReachedThreshold={0.8}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator
              size="large"
              color={appColors.primary}
              style={{marginTop: 50}}
            />
          ) : null
        }
        contentContainerStyle={{
          paddingBottom: 35,
          flexGrow: 1,
          paddingHorizontal: 10,
        }}
      />
    </View>
  );
};

export default ListTenantScreen;
