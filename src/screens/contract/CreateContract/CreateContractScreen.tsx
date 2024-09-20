import {Alert, Dimensions} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useContext, useEffect, useMemo, useState} from 'react';
import {Button, View} from '@ant-design/react-native';
import {useFieldArray, useForm} from 'react-hook-form';
import CircularProgress from 'react-native-circular-progress-indicator';

import {
  accommodationService,
  contractService,
  serviceUtilityServices,
  tenantService,
} from '@services';
import {globalStyles} from '@styles';
import {appColors} from '@const/appColors';
import {GlobalConfigContext} from '@context';
import {fontFamilies} from '@const/fontFamilies';
import {DefaultTenantInput} from '@const/tenant';
import TextComponent from '@components/TextComponent';
import TitleComponent from '@components/TitleComponent';
import {getNumberWithOrdinal} from '@utils/stringHelpers';
import TenantsInfoStep from './components/TenantsInfoStep';
import {ContractTemplateModel} from '@models/accommodation';
import ContractInfoStep from './components/ContractInfoStep';
import {CreateContractScreenProps} from '@models/navigators/HomNavigator';
import {ServiceAccommodationResponseModel} from '@models/service-utility';
import {CreateTenantModel, TenantFormInputModel} from '@models/tenant';
import {CreateContractControl, CreateContractModel} from '@models/contract';

const CreateContractScreen: React.FC<CreateContractScreenProps> = ({
  navigation,
  route,
}) => {
  const {t} = useTranslation();
  const accommodationId = route.params.accommodationId;
  const {languageMode} = useContext(GlobalConfigContext);
  const roomId = route.params.roomId;
  const roomName = route.params.roomName;
  const floor = route.params.floor;
  const rentalCost = route.params.rentalCost;
  const [step, setStep] = useState(1);
  const [createLoading, setCreateLoading] = useState(false);
  const [template, setTemplate] = useState<string>('');
  const [templates, setTemplates] = useState<ContractTemplateModel[]>([]);
  const [waterService, setWaterService] =
    useState<ServiceAccommodationResponseModel | null>(null);
  const [electricService, setElectricService] =
    useState<ServiceAccommodationResponseModel | null>(null);
  const [contractInfo, setContractInfo] = useState<CreateContractControl>();
  const today = new Date();
  const defaultPeriod = useMemo(() => {
    let currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + 12);
    return currentDate;
  }, []);
  const {
    control: contractInfoControl,
    handleSubmit: handleNext,
    setValue: setValueContractInfo,
    formState: {errors: contractInfoErrors},
  } = useForm({
    defaultValues: {
      startDate: today,
      endDate: defaultPeriod,
      deposit: '',
      rentalCost: '',
      water: '',
      electric: '',
      template: '',
    } as CreateContractControl,
  });

  const {
    handleSubmit: handleCreateContract,
    control: tenantsInfoControl,
    formState: {errors: tenantsInfoErrors},
    watch,
    setValue,
  } = useForm({
    defaultValues: {tenants: [DefaultTenantInput]}, // Initial value for tenants
  });

  const {fields, append, remove} = useFieldArray({
    control: tenantsInfoControl,
    name: 'tenants',
    rules: {minLength: 1},
  });

  const onSubmit = async (data: any) => {
    try {
      setCreateLoading(true);
      const tenants = data.tenants;

      const index = templates.findIndex(t => t.id === contractInfo?.template);

      const contractPayload: CreateContractModel = {
        roomId: roomId,
        startDate: contractInfo?.startDate as Date,
        endDate: contractInfo?.endDate as Date,
        templateType: templates[index].name,
        templateExt: templates[index].settings.ext,
        provisions: [],
        roomTenantServices: [
          {
            name: electricService!.name,
            unit: electricService!.unit,
            cost:
              parseFloat(contractInfo!.electric.replaceAll(',', '')) ||
              electricService!.cost,
            type: 'PRIMARY',
          },
          {
            name: waterService!.name,
            unit: waterService!.unit,
            cost:
              parseFloat(contractInfo!.water.replaceAll(',', '')) ||
              waterService!.cost,
            type: 'PRIMARY',
          },
          {
            name: 'rentalCost',
            unit: 'month',
            cost: parseFloat(contractInfo!.rentalCost.replaceAll(',', '')),
            type: 'PRIMARY',
          },
        ],
        tenancyDeposit: parseFloat(contractInfo!.deposit.replaceAll(',', '')),
      };
      const contract = await contractService.createContract(contractPayload);

      const tenantsPayload: CreateTenantModel[] = tenants!.map(
        (t: TenantFormInputModel, index: number) => {
          return {
            email: t.email,
            phoneNumber: t.phoneNumber || '',
            contractId: contract.id,
            isRoomLeader: index === 0 ? true : false,
            identityCards: [
              {
                identityCardNumber: t.identityCardNumber,
                type: t.type,
                name: t.name,
                gender: t.gender,
                placeOfOrigin: t.placeOfOrigin,
                placeOfResidence: t.placeOfResidence,
                birthday: t.birthday,
                country: t.country,
                expiredTime: t.expiredTime,
                imageUrlFront: t.imageUrlFront || '',
                imageUrlBehind: t.imageUrlBehind || '',
              },
            ],
          };
        },
      );
      await tenantService.createTenants(tenantsPayload, roomId);

      navigation.goBack();
    } catch (error: any) {
      Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
        {
          text: t('actions.cancel'),
          style: 'cancel',
        },
      ]);
    } finally {
      setCreateLoading(false);
    }
  };

  const onNext = (data: CreateContractControl) => {
    setContractInfo(data);
    setStep(step + 1);
  };

  const prev = () => {
    if (step > 1) setStep(step - 1);
    else navigation.goBack();
  };

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const data =
          await accommodationService.getAccommodationContractTemplates(
            accommodationId,
          );
        if (data.length > 0) {
          setTemplates(data);
          setTemplate(data[0].settings.templateUrl);
          setValueContractInfo('template', data[0]?.id || '');
        }
      } catch (error: any) {
        Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
          {
            text: t('actions.cancel'),
            style: 'cancel',
          },
        ]);
      }
    };

    const fetchPrimaryService = async () => {
      try {
        const services =
          await serviceUtilityServices.getAllServicesForAccommodation(
            accommodationId || '',
            'PRIMARY',
          );
        const water = services.find((s: any) => s.name === 'water') || null;
        const electric =
          services.find((s: any) => s.name === 'electric') || null;
        setWaterService(water);
        setElectricService(electric);
        setValueContractInfo('water', water?.cost.toString() || '');
        setValueContractInfo('electric', electric?.cost.toString() || '');
        setValueContractInfo('rentalCost', rentalCost.toString());
      } catch (error: any) {
        Alert.alert(t('alertTitle.noti'), error?.response?.data.message, [
          {
            text: t('actions.cancel'),
            style: 'cancel',
          },
        ]);
      }
    };

    fetchTemplate();
    fetchPrimaryService();
  }, [accommodationId]);

  return (
    <View style={{...globalStyles.container, rowGap: 8, paddingBottom: 8}}>
      <TitleComponent
        backgroundColor={appColors.backgroundCard}
        back
        titleStyle={{fontSize: 16}}
        title={`${t('actions.createContract')} - ${t(
          'label.room',
        )} ${roomName} - ${
          languageMode.locale === 'en'
            ? `${floor}${getNumberWithOrdinal(floor)} ${t('label.floor')}`
            : `${t('label.floor')} ${floor}`
        }`}
      />
      <View
        style={{
          backgroundColor: appColors.backgroundCard,
          borderRadius: 8,
          display: 'flex',
          padding: 8,
          marginHorizontal: 8,
          flex: 1,
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <CircularProgress
            value={step * 50}
            maxValue={100}
            progressValueColor={appColors.primary}
            activeStrokeColor={appColors.primary}
            title={t('step.title', {cur: step, total: 2})}
            showProgressValue={false}
            activeStrokeWidth={15}
            inActiveStrokeWidth={15}
            titleStyle={{fontSize: 20, fontWeight: 'bold'}}
          />
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              rowGap: 16,
            }}>
            <TextComponent
              text={
                step === 1
                  ? t('step.createContract.templateContract')
                  : t('step.createContract.addTenant')
              }
              size={20}
              styles={{
                fontFamily: fontFamilies.bold,
                maxWidth: Dimensions.get('screen').width - 120 - 16 - 16,
              }}
            />
            {step < 2 && (
              <TextComponent
                text={`${t('actions.next')}: ${t(
                  'step.createContract.addTenant',
                ).toLowerCase()}`}
                styles={[{color: appColors.gray}]}
              />
            )}
          </View>
        </View>

        {/* step */}
        {step === 1 ? (
          <ContractInfoStep
            control={contractInfoControl}
            errors={contractInfoErrors}
            waterService={waterService}
            electricService={electricService}
            templates={templates}
            templateUrl={template}
            setTemplateUrl={setTemplate}
            setValue={setValueContractInfo}
          />
        ) : (
          <TenantsInfoStep
            control={tenantsInfoControl}
            errors={tenantsInfoErrors}
            setValue={setValue}
            fields={fields}
            watch={watch}
            append={append}
            remove={remove}
            roomId={roomId}
          />
        )}
        {/* submit */}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 8,
          }}>
          <Button onPress={() => prev()} style={{width: '49%'}}>
            {step === 1 ? t('actions.cancel') : t('actions.previous')}
          </Button>
          {step < 2 && (
            <Button
              type="primary"
              style={{width: '49%'}}
              onPress={handleNext(onNext)}>
              {t('actions.next')}
            </Button>
          )}
          {step === 2 && (
            <Button
              type="primary"
              loading={createLoading}
              style={{width: '49%'}}
              onPress={handleCreateContract(onSubmit)}>
              {t('actions.createContract')}
            </Button>
          )}
        </View>
      </View>
    </View>
  );
};

export default CreateContractScreen;
