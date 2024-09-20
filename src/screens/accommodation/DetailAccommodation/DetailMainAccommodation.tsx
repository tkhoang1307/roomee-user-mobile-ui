import {
  View,
  StatusBar,
  TouchableOpacity,
  Alert,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import React, {ReactNode, useContext, useRef, useState} from 'react';
import {Portal} from 'react-native-portalize';
import {Modalize} from 'react-native-modalize';
import {useTranslation} from 'react-i18next';
import {IconOutline} from '@ant-design/icons-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {globalStyles} from '@styles';
import {appColors} from '@const/appColors';
import {
  Can,
  ModalNotiComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '@components/index';
import {fontFamilies} from '@const/fontFamilies';
import {DetailAccommodationStyle} from './styles';
import {
  AbilityContext,
  AccommodationsContext,
  MainAccommodationContext,
} from '@context';
import {AccommodationActionEnum} from '@const/accomodation';
import {accommodationService} from '@services';
import BoxServiceComponent from './components/BoxServiceComponent';
import {NotiType} from '@models/globalComponent/ModalNotiType';
import {AbilityActionEnum, AbilitySubjectEnum} from '@const/abilities';
import {DetailMainAccommodationScreenProps} from '@models/navigators/HomNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetailMainAccommodationScreen: React.FC<
  DetailMainAccommodationScreenProps
> = ({navigation}) => {
  const {mainAccommodation, mainAccommodationDispatch} = useContext(
    MainAccommodationContext,
  );

  const {t} = useTranslation();
  const ability = useContext(AbilityContext);
  const {accommodationsDispatch} = useContext(AccommodationsContext);

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const modalizeRef = useRef<Modalize>();
  const choiceBars = [
    {
      key: 'edit',
      title: t('actions.edit'),
      icon: <Icon name="home-edit-outline" size={25} color={appColors.text} />,
    },
    {
      key: 'delete',
      title: t('actions.delete'),
      icon: <Icon name="trash-can-outline" size={25} color={appColors.text} />,
    },
  ];
  const renderItem = (item: {icon: ReactNode; key: string; title: string}) => (
    <RowComponent
      key={item.key}
      styles={{marginBottom: 20}}
      onPress={() => handleChoiceAccommodation(item.key)}>
      {item.icon}
      <SpaceComponent width={12} />
      <TextComponent text={item.title} flex={1} styles={{fontSize: 16}} />
    </RowComponent>
  );

  const handleChoiceAccommodation = (key: string) => {
    switch (key) {
      case 'edit':
        navigation.navigate('ChangeInfoAccommodationScreen', {
          accommodationInfor: mainAccommodation,
          isMainAccom: true,
        });
        break;

      case 'delete':
        setOpenDeleteModal(true);
        break;
      default:
        break;
    }

    modalizeRef.current?.close();
  };

  const handleDeleteAccommodation = async () => {
    setLoading(true);
    try {
      await accommodationService.deleteAccommodation(mainAccommodation.id);
      accommodationsDispatch({
        type: AccommodationActionEnum.DELETE_ACCOMMODATION,
        payload: {id: mainAccommodation.id},
      });
      const data = await accommodationService.getAllAccommodations();

      await AsyncStorage.setItem('mainAccommodation', JSON.stringify(data[0]));
      mainAccommodationDispatch({
        type: AccommodationActionEnum.SET_CURRENT_MAIN_ACCOMMODATION,
        payload: data[0],
      });

      navigation.getParent()?.navigate('Home', {screen: 'HomeScreen'});
    } catch (error: any) {
      Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
        {
          text: t('actions.cancel'),
          style: 'cancel',
        },
      ]);
    } finally {
      setLoading(false);
      setOpenDeleteModal(false);
    }
  };

  return mainAccommodation.id === '' ? (
    <>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          backgroundColor: appColors.white,
        }}>
        <TextComponent text={t('label.noMainAccommodation')} size={20} />
      </View>
    </>
  ) : (
    <View style={[globalStyles.container]}>
      <FlatList
        data={[]}
        renderItem={({}) => <View></View>}
        // refreshing={resetLoading}
        style={{flex: 1}}
        ListHeaderComponentStyle={{flex: 1}}
        // onRefresh={() => setResetFlag(prev => !prev)}
        ListHeaderComponent={
          <View>
            <StatusBar barStyle={'light-content'} />

            <View style={DetailAccommodationStyle.headerBarStyle}>
              <View style={DetailAccommodationStyle.circleFirstStyle} />
              <View
                style={[
                  DetailAccommodationStyle.circleSecondStyle,
                  globalStyles.shadow,
                ]}
              />

              <View style={{paddingHorizontal: 16}}>
                <View style={DetailAccommodationStyle.viewContainerStyle}>
                  <View style={{width: 25}} />
                  <View>
                    <TextComponent
                      font={fontFamilies.bold}
                      text={`${mainAccommodation.name}`}
                      color={appColors.white}
                      styles={[DetailAccommodationStyle.textAccomNameStyle]}
                    />
                  </View>
                  {/* Here is bars icon, when click open a modal to change or delete accommodation */}
                  <TouchableOpacity onPress={() => modalizeRef.current?.open()}>
                    <IconOutline
                      name="bars"
                      size={25}
                      color={appColors.white}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <SpaceComponent height={14} />

              <Portal>
                <Modalize
                  adjustToContentHeight
                  ref={modalizeRef}
                  handlePosition="inside">
                  <View style={DetailAccommodationStyle.modalizeStyle}>
                    {choiceBars.map(item => renderItem(item))}
                  </View>
                </Modalize>
              </Portal>

              <SpaceComponent height={20} />
            </View>
            <ModalNotiComponent
              type={NotiType.DANGEROUS_DECISION}
              visiable={openDeleteModal}
              title={t('room.deleteModalTitle')}
              content={t('label.deleteAccommodation', {
                name: mainAccommodation.name,
              })}
              onCancel={() => setOpenDeleteModal(false)}
              loading={loading}
              onConfirm={async () => {
                handleDeleteAccommodation();
              }}
            />

            <View
              style={{
                marginTop: 10,
              }}>
              <View style={{paddingHorizontal: 16}}>
                {/* Here implement infor owner */}

                <Image
                  style={{
                    width: '100%',
                    height: 200,
                    borderRadius: 10,
                    // resizeMode: 'center',
                  }}
                  source={
                    mainAccommodation.theme
                      ? {
                          uri: mainAccommodation.theme,
                        }
                      : require('../../../assets/images/various-houses.png')
                  }
                />
                <SpaceComponent height={10} />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}>
                  <View
                    style={{
                      height: 20,
                      width: 5,
                      backgroundColor: appColors.primary,
                      borderRadius: 2,
                    }}
                  />

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginRight: 15,
                    }}>
                    <Icon name="map-marker-radius" size={25} />
                  </View>
                  <View style={{flexShrink: 1}}>
                    <TextComponent
                      text={`${mainAccommodation.location.street}, ${mainAccommodation.location.district}, ${mainAccommodation.location.cityProvince}`}
                      numberOfLine={4}
                      font={fontFamilies.bold}
                      size={14}
                    />
                  </View>
                </View>
              </View>

              <SpaceComponent height={20} />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  flexWrap: 'wrap',
                }}>
                <BoxServiceComponent
                  iconName="office-building-outline"
                  serviceName={t('subItem.viewAllRooms')}
                  onPress={() => {
                    navigation.navigate('AllRoomScreen', {
                      accommodationID: mainAccommodation.id,
                      accommodationName: mainAccommodation.name || '',
                    });
                  }}
                />
                <Can I={AbilityActionEnum.ACCESS} a={AbilitySubjectEnum.REPORT}>
                  <BoxServiceComponent
                    iconName="receipt"
                    serviceName={t('room.invoices')}
                    onPress={() =>
                      navigation.navigate('ListInvoicesOfAccommodationScreen', {
                        accommodationId: mainAccommodation.id,
                        accom: mainAccommodation,
                      })
                    }
                  />
                </Can>
                <Can I={AbilityActionEnum.ACCESS} a={AbilitySubjectEnum.REPORT}>
                  <BoxServiceComponent
                    iconName="file-sign"
                    serviceName={t('room.contract')}
                    onPress={() =>
                      navigation.navigate('AccomContractsScreen', {
                        accomId: mainAccommodation.id,
                      })
                    }
                  />
                </Can>
                <Can I={AbilityActionEnum.ACCESS} a={AbilitySubjectEnum.REPORT}>
                  <BoxServiceComponent
                    iconName="face-agent"
                    serviceName={t('request.pluralLabel')}
                    onPress={() =>
                      navigation.navigate('AccomRequestsScreen', {
                        accom: mainAccommodation,
                      })
                    }
                  />
                </Can>
                <BoxServiceComponent
                  iconName="lightbulb"
                  serviceName={t('subItem.roomContractService')}
                  onPress={() => {
                    navigation.navigate('ServiceAccommodationScreen', {
                      accommodationID: mainAccommodation.id,
                    });
                  }}
                />
                <BoxServiceComponent
                  iconName="clipboard-edit-outline"
                  serviceName={t('subItem.rules')}
                  onPress={() => {
                    navigation.navigate('ListRulesScreen', {
                      accommodationID: mainAccommodation.id,
                    });
                  }}
                />
                <Can
                  I={AbilityActionEnum.ACCESS}
                  a={AbilitySubjectEnum.TENANTS}>
                  <BoxServiceComponent
                    iconName="human-queue"
                    serviceName={t('subItem.viewTenant')}
                    onPress={() => {
                      navigation.navigate('ListTenantScreen', {
                        accommodationID: mainAccommodation.id,
                      });
                    }}
                  />
                </Can>
                <BoxServiceComponent
                  iconName="wallet-outline"
                  serviceName={t('payment.label')}
                  onPress={() => {
                    navigation.navigate('ManageListPaymentMethodScreen', {
                      accommodationId: mainAccommodation.id,
                    });
                  }}
                />
                <Can I={AbilityActionEnum.ACCESS} a={AbilitySubjectEnum.REPORT}>
                  <BoxServiceComponent
                    iconName="chart-line"
                    serviceName={t('label.reports')}
                    onPress={() => {
                      navigation.navigate('ReportScreen', {
                        accommodationId: mainAccommodation.id,
                        accommodationName: mainAccommodation.name || '',
                      });
                    }}
                  />
                </Can>
                {!ability.can(
                  AbilityActionEnum.ACCESS,
                  AbilitySubjectEnum.TENANTS,
                ) && (
                  <>
                    <View
                      style={{
                        width: Dimensions.get('window').width * 0.28,
                        height: Dimensions.get('window').height * 0.13,
                        marginHorizontal: 5,
                      }}
                    />
                    <View
                      style={{
                        width: Dimensions.get('window').width * 0.28,
                        height: Dimensions.get('window').height * 0.13,
                        marginHorizontal: 5,
                      }}
                    />
                  </>
                )}
              </View>
            </View>
          </View>
        }
      />
    </View>
  );
};

export default DetailMainAccommodationScreen;
