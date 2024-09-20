import {
  View,
  StatusBar,
  TouchableOpacity,
  Alert,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import React, {ReactNode, useContext, useEffect, useRef, useState} from 'react';
import {Portal} from 'react-native-portalize';
import {Modalize} from 'react-native-modalize';
import {useTranslation} from 'react-i18next';
import {IconOutline} from '@ant-design/icons-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {globalStyles} from '@styles';
import {appColors} from '@const/appColors';
import {
  Can,
  DividerComponent,
  ModalNotiComponent,
  PortalModalizeComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '@components/index';
import {fontFamilies} from '@const/fontFamilies';
import {useDetailAccommodation} from '@hk/useAccommodation';
import {DetailAccommodationStyle} from './styles';
import {DetailAccommodationScreenProps} from '@models/navigators/HomNavigator';
import {AbilityContext, AccommodationsContext} from '@context';
import {AccommodationActionEnum} from '@const/accomodation';
import {accommodationService} from '@services';
import BoxServiceComponent from './components/BoxServiceComponent';
import {NotiType} from '@models/globalComponent/ModalNotiType';
import IconCircleComponent from '@components/IconCircleComponent';
import {AccommodationModel} from '@models/accommodation';
import {AbilityActionEnum, AbilitySubjectEnum} from '@const/abilities';

const DetailAccommodationScreen: React.FC<DetailAccommodationScreenProps> = ({
  navigation,
  route,
}) => {
  const accommodationId = route.params.accommodationInfor.id;

  const {accommodation, resetFlag, resetLoading, setResetFlag} =
    useDetailAccommodation(accommodationId);
  const {t} = useTranslation();
  const ability = useContext(AbilityContext);
  const {accommodationsDispatch} = useContext(AccommodationsContext);
  const [allAccommodation, setAllAccommodation] = useState<
    AccommodationModel[]
  >([]);

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

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
          accommodationInfor: accommodation,
          isMainAccom: false,
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
    try {
      await accommodationService.deleteAccommodation(accommodationId);
      accommodationsDispatch({
        type: AccommodationActionEnum.DELETE_ACCOMMODATION,
        payload: {id: accommodationId},
      });
      navigation.navigate('HomeScreen');
    } catch (error: any) {
      Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
        {
          text: t('actions.cancel'),
          style: 'cancel',
        },
      ]);
    } finally {
      setOpenDeleteModal(false);
    }
  };

  const modalizeAllAccommoationRef = useRef<Modalize>();
  const choiceBarsAllAccommodation = allAccommodation.map((item: any) => {
    return {
      key: item.id,
      title: t('accommodation.accommodationText') + ': ' + item.name,
      icon: <IconOutline name="home" size={22} color={appColors.text} />,
    };
  });
  const renderItemAllAccommodation = (item: {
    icon: ReactNode;
    key: string;
    title: string;
  }) => (
    <View key={item.key}>
      <RowComponent
        key={item.key}
        onPress={() => handleChoiceOtherAccommodation(item.key)}>
        {item.icon}
        <SpaceComponent width={12} />
        <TextComponent text={item.title} flex={1} />
      </RowComponent>
      <DividerComponent
        width="100%"
        styles={{marginBottom: 20, marginTop: 10}}
      />
    </View>
  );
  const handleChoiceOtherAccommodation = (key: string) => {
    const selectedAccommodation = allAccommodation.find(
      item => item.id === key,
    );
    if (selectedAccommodation) {
      navigation.navigate('DetailAccommodationScreen', {
        accommodationInfor: selectedAccommodation,
      });
    }
    modalizeAllAccommoationRef.current?.close();
  };

  useEffect(() => {
    const getAllAccommodations = async () => {
      try {
        const data = await accommodationService.getAllAccommodations();
        setAllAccommodation(data);
      } catch (error: any) {
        Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
          {
            text: t('actions.cancel'),
            style: 'cancel',
          },
        ]);
      }
    };

    getAllAccommodations();
  }, [accommodationId, resetFlag]);

  return (
    <View style={[globalStyles.container]}>
      <FlatList
        data={[]}
        renderItem={({}) => <View></View>}
        refreshing={resetLoading}
        style={{flex: 1}}
        ListHeaderComponentStyle={{flex: 1}}
        onRefresh={() => setResetFlag(prev => !prev)}
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

              <PortalModalizeComponent
                choiceBars={choiceBarsAllAccommodation}
                modalizeRef={modalizeAllAccommoationRef}
                renderItem={renderItemAllAccommodation}
              />

              <View style={{paddingHorizontal: 16}}>
                <View style={DetailAccommodationStyle.viewContainerStyle}>
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        modalizeAllAccommoationRef.current?.open();
                      }}>
                      <IconCircleComponent
                        name="home"
                        sizeCircle={50}
                        sizeIcon={30}
                        colorCircle={'rgb(233, 154, 27)'}
                        colorIcon={appColors.white}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={DetailAccommodationStyle.viewAccomStyle}>
                    <TextComponent
                      font={fontFamilies.bold}
                      text={`${accommodation.name}`}
                      color={appColors.white}
                      styles={[DetailAccommodationStyle.textAccomNameStyle]}
                    />
                  </View>
                  {/* Here is bars icon, when click open a modal to change or delete accommodation */}

                  <View
                    style={{
                      width: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Can
                      I={AbilityActionEnum.EDIT}
                      a={AbilitySubjectEnum.ACCOMODATION}>
                      <TouchableOpacity
                        onPress={() => modalizeRef.current?.open()}>
                        <IconOutline
                          name="bars"
                          size={25}
                          color={appColors.white}
                        />
                      </TouchableOpacity>
                    </Can>
                  </View>
                </View>
              </View>

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
                name: accommodation.name,
              })}
              onCancel={() => setOpenDeleteModal(false)}
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
                    accommodation.theme
                      ? {
                          uri: accommodation.theme,
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
                      text={`${accommodation.location.street}, ${accommodation.location.district}, ${accommodation.location.cityProvince}`}
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
                      accommodationID: accommodationId,
                      accommodationName: accommodation.name || '',
                    });
                  }}
                />
                <Can I={AbilityActionEnum.ACCESS} a={AbilitySubjectEnum.REPORT}>
                  <BoxServiceComponent
                    iconName="receipt"
                    serviceName={t('room.invoices')}
                    onPress={() =>
                      navigation.navigate('ListInvoicesOfAccommodationScreen', {
                        accommodationId: accommodationId,
                        accom: accommodation,
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
                        accomId: accommodationId,
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
                        accom: accommodation,
                      })
                    }
                  />
                </Can>
                <BoxServiceComponent
                  iconName="lightbulb"
                  serviceName={t('subItem.roomContractService')}
                  onPress={() => {
                    navigation.navigate('ServiceAccommodationScreen', {
                      accommodationID: accommodationId,
                    });
                  }}
                />
                <BoxServiceComponent
                  iconName="clipboard-edit-outline"
                  serviceName={t('subItem.rules')}
                  onPress={() => {
                    navigation.navigate('ListRulesScreen', {
                      accommodationID: accommodationId,
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
                        accommodationID: accommodationId,
                      });
                    }}
                  />
                </Can>
                <BoxServiceComponent
                  iconName="wallet-outline"
                  serviceName={t('payment.label')}
                  onPress={() => {
                    navigation.navigate('ManageListPaymentMethodScreen', {
                      accommodationId: accommodationId,
                    });
                  }}
                />
                <Can I={AbilityActionEnum.ACCESS} a={AbilitySubjectEnum.REPORT}>
                  <BoxServiceComponent
                    iconName="chart-line"
                    serviceName={t('label.reports')}
                    onPress={() => {
                      navigation.navigate('ReportScreen', {
                        accommodationId: accommodationId,
                        accommodationName: accommodation.name || '',
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

export default DetailAccommodationScreen;
