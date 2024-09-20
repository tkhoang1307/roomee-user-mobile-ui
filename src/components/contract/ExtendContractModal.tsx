import {useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Modal} from '@ant-design/react-native';

import {contractService, roomService} from '@services';
import {ContractModel, ExtendContractControl} from '@models/contract';
import TextComponent from '@components/TextComponent';
import {Controller, useForm} from 'react-hook-form';
import InputComponent from '@components/InputComponent';
import {AccommodationService, AccomRoomModel} from '@models/accommodation';
import {findAccommodationService, getRoomById} from '@utils/accommodation';
import {useDetailAccommodation} from '@hk/useAccommodation';
import {PrimaryServiceEnum} from '@const/accomodation';
import DateTimePicker from '@components/DatetimePicker';

interface ExtendContractModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  contract: ContractModel | undefined;
  setContract: React.Dispatch<React.SetStateAction<ContractModel | undefined>>;
  setReload?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExtendContractModal: React.FC<ExtendContractModalProps> = ({
  open,
  setOpen,
  contract,
  setReload,
}) => {
  const {t} = useTranslation();
  const {accommodation} = useDetailAccommodation(
    contract?.room.accommodationId || '',
  );
  const [room, setRoom] = useState<AccomRoomModel>();
  const [waterService, setWaterService] = useState<AccommodationService | null>(
    null,
  );
  const [electricService, setElectricService] =
    useState<AccommodationService | null>(null);
  const minDate = useMemo(
    () =>
      new Date(
        (new Date(contract?.endDate as any) || new Date()).getTime() +
          24 * 60 * 60 * 1000,
      ),
    [contract],
  );
  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
    reset,
  } = useForm({
    defaultValues: {
      endDate: minDate,
      rentalCost: '',
      water: '',
      electric: '',
    } as ExtendContractControl,
  });

  const onSubmitExtend = async (value: ExtendContractControl) => {
    try {
      await contractService.extendContract(contract?.id || '', {
        endDate: value.endDate,
        roomTenantServices: [
          {
            name: electricService!.name,
            unit: electricService!.unit,
            cost:
              parseFloat(value!.electric.replaceAll(',', '')) ||
              electricService!.cost,
            type: 'PRIMARY',
          },
          {
            name: waterService!.name,
            unit: waterService!.unit,
            cost:
              parseFloat(value!.water.replaceAll(',', '')) ||
              waterService!.cost,
            type: 'PRIMARY',
          },
          {
            name: 'rentalCost',
            unit: 'month',
            cost: parseFloat(value!.rentalCost.replaceAll(',', '')),
            type: 'PRIMARY',
          },
        ],
      });
      if (setReload) setReload(prev => !prev);
    } catch (_error: any) {
    } finally {
      // setLoading(false);
      setOpen(false);
    }
  };

  useEffect(() => {
    const getRoomCost = async () => {
      try {
        const rooms = await roomService.getAllRoomAccomodation(
          contract?.room.accommodationId || '',
        );
        const roomByName = getRoomById(rooms, contract?.roomId || '');
        if (roomByName) {
          setRoom(roomByName);
        }
      } catch (_error: any) {}
    };
    getRoomCost();
  }, []);

  useEffect(() => {
    if (open) {
      reset();
      if (
        accommodation.primaryServices &&
        accommodation.primaryServices.length > 0
      ) {
        const waterService = findAccommodationService(
          PrimaryServiceEnum.WATER,
          accommodation.primaryServices,
        );
        const electricService = findAccommodationService(
          PrimaryServiceEnum.ELECTRIC,
          accommodation.primaryServices,
        );
        setValue('rentalCost', room?.rentCost.toString() || '');
        setValue('water', waterService?.cost.toString() || '');
        setValue('electric', electricService?.cost.toString() || '');
        setWaterService(waterService);
        setElectricService(electricService);
      }
    }
  }, [open, room]);

  return (
    <Modal
      title={t('label.extendContract')}
      transparent
      maskClosable
      visible={open}
      // onClose={() => setOpen(false)}
      footer={[
        {text: t('actions.cancel'), onPress: () => setOpen(false)},
        {
          text: t('actions.submit'),
          onPress: handleSubmit(onSubmitExtend),
        },
      ]}>
      <View
        style={{
          // alignItems: 'center',
          marginTop: 22,
        }}>
        <View style={{height: 100}}>
          <Controller
            name="endDate"
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {value, onChange}}) => (
              <DateTimePicker
                label={t('label.endDate') + ':'}
                type="date"
                onSelect={val => onChange(new Date(val))}
                selected={value}
                require
                minDate={minDate}
              />
            )}
          />
        </View>
        <Controller
          name="rentalCost"
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <InputComponent
              label={t('label.rentalCost')}
              value={value}
              onChange={val => {
                const numStr = parseFloat(val.replaceAll(',', '')) || '';
                onChange(
                  numStr ? new Intl.NumberFormat('ja-JP').format(numStr) : '',
                );
              }}
              onBlur={onBlur}
              numeric
              require
              errorMessage={
                errors.rentalCost ? t('validation.costRequired') : undefined
              }
              suffix={
                <TextComponent size={18}>{`₫ / ${t(
                  'service.rentalCost.unit.month',
                )}`}</TextComponent>
              }
            />
          )}
        />
        <Controller
          name="water"
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <InputComponent
              label={t('label.waterCost')}
              value={value}
              onChange={val => {
                const numStr = parseFloat(val.replaceAll(',', '')) || '';
                onChange(
                  numStr ? new Intl.NumberFormat('ja-JP').format(numStr) : '',
                );
              }}
              onBlur={onBlur}
              numeric
              require
              errorMessage={
                errors.water ? t('validation.costRequired') : undefined
              }
              suffix={
                <TextComponent size={18}>
                  {waterService
                    ? `₫ / ${t(
                        `service.${waterService.name}.unit.${waterService.unit}`,
                      )}`
                    : '₫'}
                </TextComponent>
              }
            />
          )}
        />
        <Controller
          name="electric"
          control={control}
          rules={{
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <InputComponent
              label={t('label.electricityCost')}
              value={value}
              onChange={val => {
                const numStr = parseFloat(val.replaceAll(',', '')) || '';
                onChange(
                  numStr ? new Intl.NumberFormat('ja-JP').format(numStr) : '',
                );
              }}
              onBlur={onBlur}
              numeric
              require
              errorMessage={
                errors.electric ? t('validation.costRequired') : undefined
              }
              suffix={
                <TextComponent size={18}>
                  {electricService
                    ? `₫ / ${t(
                        `service.${electricService.name}.unit.${electricService.unit}`,
                      )}`
                    : '₫'}
                </TextComponent>
              }
            />
          )}
        />
      </View>
    </Modal>
  );
};

export default ExtendContractModal;
