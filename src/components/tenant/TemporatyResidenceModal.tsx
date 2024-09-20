import {Alert, View} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Modal} from '@ant-design/react-native';
import {Controller, useForm} from 'react-hook-form';
import DateTimePicker from '@components/DatetimePicker';
import {TenantModel} from '@models/tenant';
import TextComponent from '@components/TextComponent';
import {appColors} from '@const/appColors';
import {roomService} from '@services';

interface TemporatyResidenceModalProps {
  roomId: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tenant: TenantModel;
  tenants: TenantModel[];
  setTenants: React.Dispatch<React.SetStateAction<TenantModel[]>>;
}

interface TemporaryResidenceControl {
  startDate: Date;
  endDate: Date;
}

const TemporatyResidenceModal: React.FC<TemporatyResidenceModalProps> = ({
  roomId,
  open,
  setOpen,
  tenant,
  setTenants,
}) => {
  const {t} = useTranslation();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      startDate:
        !!tenant.temporaryResidenceRegistrationStartDate &&
        new Date(tenant.temporaryResidenceRegistrationStartDate),
      endDate:
        !!tenant.temporaryResidenceRegistrationEndDate &&
        new Date(tenant.temporaryResidenceRegistrationEndDate),
    } as TemporaryResidenceControl,
  });

  const onSubmit = async (data: TemporaryResidenceControl) => {
    const startDate = data.startDate.toISOString();
    const endDate = data.endDate.toISOString();
    try {
      await roomService.updateTenantRegistration(
        roomId,
        tenant.id,
        startDate,
        endDate,
      );
      setTenants(prev => {
        return prev.map(t => {
          if (t.id !== tenant.id) return t;
          return {
            ...t,
            temporaryResidenceRegistrationStartDate: startDate,
            temporaryResidenceRegistrationEndDate: endDate,
          };
        });
      });
      Alert.alert(t('alertTitle.noti'), t('success.editTemporaryResidence'), [
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
      setOpen(false);
    }
  };

  return (
    <Modal
      title={t('label.temporaryResidence')}
      transparent
      maskClosable
      visible={open}
      // onClose={() => setOpen(false)}
      footer={[
        {text: t('actions.cancel'), onPress: () => setOpen(false)},
        {
          text: t('actions.submit'),
          onPress: handleSubmit(onSubmit),
        },
      ]}>
      <View
        style={{
          // alignItems: 'center',
          marginTop: 22,
        }}>
        <View style={{height: 220}}>
          <Controller
            name="startDate"
            control={control}
            rules={{
              required: t('validation.startDateRequired'),
            }}
            render={({field: {value, onChange}}) => (
              <>
                <DateTimePicker
                  label={t('label.startDate') + ':'}
                  type="date"
                  onSelect={val => onChange(new Date(val))}
                  selected={value}
                  require
                />
                {errors.startDate && (
                  <TextComponent color={appColors.danger}>
                    {errors.startDate.message}
                  </TextComponent>
                )}
              </>
            )}
          />
          <Controller
            name="endDate"
            control={control}
            rules={{
              required: t('validation.endDateRequired'),
            }}
            render={({field: {value, onChange}}) => (
              <>
                <DateTimePicker
                  label={t('label.endDate') + ':'}
                  type="date"
                  onSelect={val => onChange(new Date(val))}
                  selected={value}
                  require
                  // minDate={minDate}
                />
                {errors.endDate && (
                  <TextComponent
                    color={appColors.danger}
                    styles={{marginVertical: 5}}>
                    {errors.endDate.message}
                  </TextComponent>
                )}
              </>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

export default TemporatyResidenceModal;
