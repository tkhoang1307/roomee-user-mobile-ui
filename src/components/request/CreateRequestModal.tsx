import {differenceBy} from 'lodash';
import {useTranslation} from 'react-i18next';
import {Portal} from 'react-native-portalize';
import {Modalize} from 'react-native-modalize';
import {IHandles} from 'react-native-modalize/lib/options';
import {MutableRefObject, useEffect, useMemo, useState} from 'react';
import {Button, List, Tabs, TextareaItem} from '@ant-design/react-native';
import {ActivityIndicator, ScrollView, View, ViewStyle} from 'react-native';
import CheckboxItem from '@ant-design/react-native/lib/checkbox/CheckboxItem';

import {InputComponent, TextComponent} from '..';
import {globalStyles} from '@styles';
import {appColors} from '@const/appColors';
import {RequestType} from '@models/request';
import {MONEY_FORMAT_BY} from '@const/index';
import {roomService, serviceUtilityServices} from '@services';
import UploadImage from '@components/UploadImage';
import useCreateRequest from '@hk/request/useCreateRequest';
import {ServiceAccommodationResponseModel} from '@models/service-utility';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {RoomPropertyModel} from '@models/room';

interface CreateRequestModalProps {
  roomId: string;
  accomId: string;
  modalizeRef: MutableRefObject<IHandles | undefined>;
}

const CreateRequestModal: React.FC<CreateRequestModalProps> = ({
  roomId,
  accomId,
  modalizeRef,
}) => {
  const {t} = useTranslation();
  const tabs = useMemo(
    () => [
      {
        title: t(`request.type.${RequestType.ROOM_REPAIR}`),
        value: RequestType.ROOM_REPAIR,
      },
      {
        title: t(`request.type.${RequestType.SERVICE}`),
        value: RequestType.SERVICE,
      },
      {
        title: t(`request.type.${RequestType.OTHERS}`),
        value: RequestType.OTHERS,
      },
    ],
    [],
  );
  const [curTab, setCurTab] = useState(0);
  const [expense, setExpense] = useState<string>('');
  const [desRoomRepair, setDesRoomRepair] = useState('');
  const [desService, setDesService] = useState('');
  const [desOthers, setDesOthers] = useState('');
  const [loadingServices, setLoadingServices] = useState(false);
  const [services, setServices] = useState<ServiceAccommodationResponseModel[]>(
    [],
  );
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const {loadingCreate, createRequest} = useCreateRequest();
  const [selectedRoomRepairImages, setSelectedRoomRepairImages] = useState<
    ImageOrVideo[]
  >([]);
  const [selectedOthersImages, setSelectedOthersImages] = useState<
    ImageOrVideo[]
  >([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [listRoomProperties, setListRoomProperties] = useState<
    RoomPropertyModel[]
  >([]);
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<string[]>([]);

  const onSubmit = async () => {
    const newExpenseStr = parseFloat(expense.replaceAll(',', '')) || 0;
    const newExpense = isNaN(newExpenseStr) ? 0 : newExpenseStr;
    const roomProperties = selectedPropertyIds.map(i => {
      const index = listRoomProperties.findIndex(p => p.id === i);
      return listRoomProperties[index].name;
    });
    await createRequest({
      type: tabs[curTab].value,
      roomId,
      description:
        curTab === 0 ? desRoomRepair : curTab === 1 ? desService : desOthers,
      meta:
        curTab === 0
          ? {
              expense: newExpense,
              roomProperties: roomProperties,
            }
          : curTab === 1
          ? {accommodationServiceIds: selectedServices}
          : undefined,
      imgs:
        curTab === 0
          ? selectedRoomRepairImages
          : curTab === 1
          ? []
          : selectedOthersImages,
    });
    modalizeRef.current?.close();
  };

  useEffect(() => {
    setLoadingProperties(true);
    const fetchRoomProperties = async () => {
      try {
        const resData = await roomService.getAllRoomProperties(roomId);
        setListRoomProperties(resData);
      } catch (error: any) {
        // toast.error(error?.response?.data.message);
      } finally {
        setLoadingProperties(false);
      }
    };

    fetchRoomProperties();
  }, []);

  useEffect(() => {
    const getServices = async () => {
      setLoadingServices(true);
      try {
        const [accommodationServices, roomServices] = await Promise.all([
          serviceUtilityServices.getAllServicesForAccommodation(accomId, 'ALL'),
          serviceUtilityServices.getAllServicesForRoom(roomId, 'ALL'),
        ]);

        const filterRoomNotRegisteredService = roomServices.filter(
          service => !service.deleted,
        );
        const dictinctService = differenceBy(
          accommodationServices,
          filterRoomNotRegisteredService,
          service => `${service.name}-${service.unit}`,
        );

        setServices(dictinctService);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingServices(false);
      }
    };

    getServices();
  }, []);

  return (
    <Portal>
      <Modalize
        adjustToContentHeight
        ref={modalizeRef}
        handlePosition="outside"
        onOpen={() => {
          setDesRoomRepair('');
          setDesService('');
          setDesOthers('');
          setExpense('');
          setSelectedServices([]);
          setSelectedPropertyIds([]);
          setSelectedRoomRepairImages([]);
          setSelectedOthersImages([]);
          setCurTab(0);
        }}>
        <Tabs tabs={tabs} onTabClick={(_data, index) => setCurTab(index)}>
          {/* room repair  */}
          <ScrollView>
            <View style={requestContainerStyle}>
              <TextComponent>{t('label.description') + ':'}</TextComponent>
              <TextareaItem
                placeholder={t('request.writeDescription')}
                style={textAreaStyle}
                autoHeight
                value={desRoomRepair}
                onChange={c => setDesRoomRepair(c || '')}
              />
              <TextComponent>{t('request.expense') + ':'}</TextComponent>
              <InputComponent
                styleInput={{...textAreaStyle, marginTop: 0}}
                value={expense}
                onChange={val => {
                  if (val === '0') return setExpense('0');
                  const numStr = parseFloat(val.replaceAll(',', '')) || '';
                  setExpense(
                    numStr ? new Intl.NumberFormat('ja-JP').format(numStr) : '',
                  );
                }}
                placeholder="0"
                numeric
                suffix={<TextComponent size={18}>₫</TextComponent>}
              />
              <TextComponent styles={{marginTop: -26}}>
                {t('request.properties') + ':'}
              </TextComponent>
              {!loadingProperties ? (
                listRoomProperties.length === 0 ? (
                  <TextComponent>{t('request.noProperties')}</TextComponent>
                ) : (
                  <List>
                    {listRoomProperties.map(s => (
                      <CheckboxItem
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedPropertyIds(prev => [...prev, s.id]);
                          } else {
                            setSelectedPropertyIds(prev => [
                              ...prev.filter(x => x !== s.id),
                            ]);
                          }
                        }}
                        checked={selectedPropertyIds.includes(s.id)}
                        key={s.id}>
                        <TextComponent>{s.name}</TextComponent>
                      </CheckboxItem>
                    ))}
                  </List>
                )
              ) : (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                  }}>
                  <ActivityIndicator size={30} color={appColors.primary} />
                </View>
              )}
              <View style={{marginTop: 2, rowGap: 8}}>
                <TextComponent>{t('request.image') + ':'}</TextComponent>
                <UploadImage
                  options={{multiple: true}}
                  showResult
                  selectedFiles={selectedRoomRepairImages}
                  setSelectedFiles={setSelectedRoomRepairImages}
                />
              </View>
            </View>
          </ScrollView>

          {/* service  */}
          <ScrollView>
            <View style={requestContainerStyle}>
              <TextComponent>{t('label.description') + ':'}</TextComponent>
              <TextareaItem
                placeholder={t('request.writeDescription')}
                style={textAreaStyle}
                autoHeight
                value={desService}
                onChange={c => setDesService(c || '')}
              />
              <TextComponent>{t('request.service') + ':'}</TextComponent>
              {!loadingServices ? (
                services.length === 0 ? (
                  <TextComponent>{t('request.noServices')}</TextComponent>
                ) : (
                  <List>
                    {services.map(s => (
                      <CheckboxItem
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedServices(prev => [...prev, s.id]);
                          } else {
                            setSelectedServices(prev => [
                              ...prev.filter(x => x !== s.id),
                            ]);
                          }
                        }}
                        checked={selectedServices.includes(s.id)}
                        key={s.id}>
                        <View style={{flexDirection: 'row', columnGap: 8}}>
                          <TextComponent>
                            {t(`service.${s.name}.name`) + ':'}
                          </TextComponent>
                          <TextComponent>
                            {s.cost.toString().replace(MONEY_FORMAT_BY, ',')} /{' '}
                            {t(`service.${s.name}.unit.${s.unit}`)}
                          </TextComponent>
                        </View>
                      </CheckboxItem>
                    ))}
                  </List>
                )
              ) : (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                  }}>
                  <ActivityIndicator size={30} color={appColors.primary} />
                </View>
              )}
            </View>
          </ScrollView>

          {/* others */}
          <ScrollView>
            <View style={requestContainerStyle}>
              <TextComponent>{t('label.description') + ':'}</TextComponent>
              <TextareaItem
                placeholder={t('request.writeDescription')}
                style={textAreaStyle}
                autoHeight
                value={desOthers}
                onChange={c => setDesOthers(c || '')}
              />
              <TextComponent>{t('request.image') + ':'}</TextComponent>
              <UploadImage
                options={{multiple: true}}
                showResult
                selectedFiles={selectedOthersImages}
                setSelectedFiles={setSelectedOthersImages}
              />
            </View>
          </ScrollView>
        </Tabs>
        <Button
          type="primary"
          style={globalStyles.closePopupButton}
          onPress={() => onSubmit()}
          loading={loadingCreate}
          disabled={
            curTab === 0
              ? desRoomRepair.length === 0
              : curTab === 1
              ? desService.length === 0
              : curTab === 2
              ? desOthers.length === 0
              : false
          }>
          {t('actions.submit')}
        </Button>
      </Modalize>
    </Portal>
  );
};

const textAreaStyle: ViewStyle = {
  borderRadius: 20,
  borderColor: appColors.gray,
  borderWidth: 1,
  paddingRight: 16,
  paddingLeft: 16,
};
const requestContainerStyle: ViewStyle = {
  minHeight: 500,
  padding: 8,
  rowGap: 8,
};

export default CreateRequestModal;
