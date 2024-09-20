import {ActivityIndicator, Alert, Modal, View} from 'react-native';
import React, {useContext, useMemo, useState} from 'react';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {useTranslation} from 'react-i18next';
import moment from 'moment';

import {globalStyles} from '@styles';
import ContainerComponent from '@components/ContainerComponent';
import {
  AvatarComponent,
  ButtonComponent,
  ButtonImagePicker,
  DateTimePicker,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TitleComponent,
} from '@components/index';
import {UserContext} from '@context';
import {userService} from '@services';
import {UserConst} from '@const/index';
import {ModalStyles} from '../styles';
import {extractFileNameFromPath} from '@utils/extractFileNameFromPath';
import {appColors} from '@const/appColors';
import {DATE_FORMAT} from '@const/format';
interface updateData {
  fullname: string;
  birthday: string | null;
}
const EditProfileScreen = () => {
  const {t} = useTranslation();
  const {userState, userDispatch} = useContext(UserContext);
  const [updateData, setUpdateData] = useState<updateData>({
    fullname: userState.name,
    birthday: userState.birthday ? userState.birthday : null,
  });
  const [imageUpdate, setImageUpdate] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingUserInfo, setLoadingUserInfo] = useState<boolean>(false);

  const disableButton = useMemo(() => {
    if (userState.birthday) {
      return (
        (updateData.fullname === userState.name &&
          updateData.birthday === userState.birthday) ||
        updateData.birthday === '' ||
        updateData.fullname === ''
      );
    }
    return (
      (updateData.fullname === userState.name &&
        !updateData.birthday === !userState.birthday) ||
      updateData.birthday === '' ||
      updateData.fullname === ''
    );
  }, [updateData]);

  const handleFileSelected = async (val: ImageOrVideo) => {
    setLoading(true);
    const basename = extractFileNameFromPath(val.path);
    const photo = {
      uri: val.path,
      type: val.mime,
      name: basename,
      size: val.size,
    };
    const formData = new FormData();
    formData.append('file', photo);
    try {
      const data = await userService.uploadAvatar(formData);
      setImageUpdate(data.newImageUrl);
      userDispatch({
        type: UserConst.EDIT_PROFILE,
        payload: {imageUrl: data.newImageUrl},
      });
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
  const handleChangeValue = (key: string, value: string | Date | string[]) => {
    const items: any = {...updateData};

    items[`${key}`] = value;

    setUpdateData(items);
  };
  const onUpdateProfile = async () => {
    setLoadingUserInfo(true);
    try {
      const payload = {
        name: updateData.fullname,
        birthday:
          updateData.birthday !== userState.birthday
            ? moment(updateData.birthday).format('DD/MM/YYYY')
            : updateData.birthday,
      };
      const data = await userService.uploadUserInfor(payload);
      userDispatch({type: UserConst.EDIT_PROFILE, payload: {...data}});
      setUpdateData({fullname: data.name, birthday: data.birthday});
      Alert.alert(t('alertTitle.noti'), t('success.updateInfoSuccess'), [
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
      setLoadingUserInfo(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <TitleComponent
        back
        title={t('accountDetail.editInfor')}
        titleStyle={{fontSize: 20}}
      />

      <SectionComponent
        styles={{backgroundColor: appColors.white, marginTop: 10, flex: 1}}>
        <ContainerComponent isScroll>
          <RowComponent styles={{marginTop: 20}}>
            <AvatarComponent
              imageUrl={imageUpdate || userState.imageUrl}
              name={userState.name}
              size={120}
            />
          </RowComponent>
          <SpaceComponent height={16} />
          <RowComponent>
            <ButtonImagePicker
              onSelect={(val: any) => {
                handleFileSelected(val.value);
              }}
            />
          </RowComponent>
          <InputComponent
            label={t('accountDetail.fullName')}
            placeholder={t('placeholders.fullName')}
            allowClear
            value={updateData?.fullname}
            onChange={val => handleChangeValue('fullname', val)}
          />
          <DateTimePicker
            label={t('accountDetail.birthday') + ':'}
            type="date"
            onSelect={val => handleChangeValue('birthday', val)}
            selected={
              updateData.birthday
                ? moment(updateData.birthday, DATE_FORMAT).toDate()
                : undefined
            }
          />
        </ContainerComponent>
      </SectionComponent>
      <SectionComponent styles={{backgroundColor: appColors.white}}>
        <ButtonComponent
          disable={disableButton}
          loading={loadingUserInfo}
          text={t('actions.update')}
          onPress={onUpdateProfile}
          type="primary"
        />
      </SectionComponent>

      {loading && (
        <Modal transparent={true} animationType="fade">
          <View style={ModalStyles.overlayModal}>
            <ActivityIndicator size="large" color="#faad14" />
          </View>
        </Modal>
      )}
    </View>
  );
};

export default EditProfileScreen;
