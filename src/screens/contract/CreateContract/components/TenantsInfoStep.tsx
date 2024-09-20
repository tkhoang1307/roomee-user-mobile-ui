import {
  Control,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native-gesture-handler';

import Divider from './Divider';
import {appColors} from '@const/appColors';
import {Button} from '@ant-design/react-native';
import TenantInputCard from './TenantInputCard';
import {DefaultTenantInput} from '@const/tenant';
import TextComponent from '@components/TextComponent';
import {CreateTenantInputControl} from '@models/tenant';

interface TenantsInfoStepProps {
  control: Control<
    {
      tenants: CreateTenantInputControl[];
    },
    any
  >;
  errors: FieldErrors<{
    tenants: CreateTenantInputControl[];
  }>;
  setValue: UseFormSetValue<{
    tenants: CreateTenantInputControl[];
  }>;
  fields: Record<'id', string>[];
  watch: UseFormWatch<{
    tenants: CreateTenantInputControl[];
  }>;
  append: UseFieldArrayAppend<
    {
      tenants: CreateTenantInputControl[];
    },
    'tenants'
  >;
  remove: UseFieldArrayRemove;
  roomId: string;
}

const TenantsInfoStep: React.FC<TenantsInfoStepProps> = ({
  control,
  fields,
  watch,
  errors,
  setValue,
  append,
  remove,
  roomId,
}) => {
  const {t} = useTranslation();

  const tenants = watch('tenants');

  return (
    <ScrollView>
      {fields.map((tenant, index) => (
        <View key={tenant.id}>
          {/* divider */}
          <Divider />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TextComponent size={16}>
              {`${t('accountDetail.role.tenant')} ${index + 1} ${
                index === 0
                  ? `(${t('tenantInfomation.isRoomLeader').toLowerCase()})`
                  : ''
              }`}
            </TextComponent>
            {tenants.length > 1 && (
              <>
                <Button
                  onPress={() => remove(index)}
                  underlayColor={appColors.gray2}
                  accessibilityIgnoresInvertColors
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 15,
                    paddingLeft: 0,
                    paddingRight: 0,
                    backgroundColor: appColors.gray2,
                    borderColor: appColors.gray2,
                  }}>
                  <TextComponent styles={{marginTop: -4}} size={16}>
                    ✕
                  </TextComponent>
                </Button>
              </>
            )}
          </View>
          <TenantInputCard
            control={control}
            errors={errors}
            index={index}
            setValue={setValue}
            roomId={roomId}
          />
        </View>
      ))}
      <Button onPress={() => append(DefaultTenantInput)} style={{marginTop: 8}}>
        {t('actions.addMoreTenants')}
      </Button>
    </ScrollView>
  );
};

export default TenantsInfoStep;
