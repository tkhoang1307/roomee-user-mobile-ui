import {
  ActivityIndicator,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import moment from 'moment';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {Can} from '@context';
import {globalStyles} from '@styles';
import {DATE_FORMAT} from '@const/format';
import {appColors} from '@const/appColors';
import PdfPopup from '@components/PdfPopup';
import InfoTypo from '@components/InforTypo';
import {ContractModel} from '@models/contract';
import {formatPrice} from '@utils/stringHelpers';
import {ContractStateEnum} from '@const/contract';
import {AccomRoomModel} from '@models/accommodation';
import TextComponent from '@components/TextComponent';
import ExtendContractModal from './ExtendContractModal';
import TerminateContractModal from './TerminateContractModal';
import {RootStackParamList} from '@models/navigators/HomNavigator';
import {AbilityActionEnum, AbilitySubjectEnum} from '@const/abilities';
import CardTitleWithSharp from '@components/CardTitleWithSharp';

interface ContractInfoProps {
  loading: boolean;
  contract: ContractModel | undefined;
  room?: AccomRoomModel;
  editable?: boolean;
  currentContract?: boolean;
  setContract: React.Dispatch<React.SetStateAction<ContractModel | undefined>>;
  setReloadContractFlag: React.Dispatch<React.SetStateAction<boolean>>;
  navigation?: NativeStackNavigationProp<
    RootStackParamList,
    'DetailRoomScreen' | 'DetailContractScreen',
    undefined
  >;
  minimal?: boolean;
}

const ContractInfoCard: React.FC<ContractInfoProps> = ({
  loading,
  contract,
  room,
  editable,
  setContract,
  setReloadContractFlag,
  currentContract,
  navigation,
  minimal,
}) => {
  const {t} = useTranslation();
  const [openPdf, setOpenPdf] = useState(false);
  const [openExtendModal, setOpenExtendModal] = useState(false);
  const [openTerminateModal, setOpenTerminateModal] = useState(false);

  return (
    <View style={globalStyles.cardInfo}>
      <CardTitleWithSharp title={t('label.contractInfo')}>
        <View style={{flexDirection: 'row', columnGap: 8}}>
          {!contract && !loading && editable && (
            <Can I={AbilityActionEnum.CREATE} a={AbilitySubjectEnum.CONTRACT}>
              <TouchableOpacity
                style={globalStyles.iconButton}
                onPress={() =>
                  navigation?.navigate('CreateContractScreen', {
                    accommodationId: room?.accommodationId || '',
                    roomId: room?.id || '',
                    roomName: room?.name || '',
                    floor: room?.floor || 0,
                    rentalCost: room?.rentCost || 0,
                  })
                }>
                <Icon name="plus" size={30} />
              </TouchableOpacity>
            </Can>
          )}
          {contract && contract.templateUrl && (
            <TouchableOpacity
              style={globalStyles.iconButton}
              onPress={() => setOpenPdf(true)}>
              <Icon name="file-pdf-box" size={20} />
            </TouchableOpacity>
          )}
          {editable &&
            currentContract &&
            contract &&
            contract.state !== ContractStateEnum.TERMINATED &&
            contract.state !== ContractStateEnum.EXPIRED && (
              <>
                <TouchableOpacity
                  style={globalStyles.iconButton}
                  onPress={() => setOpenExtendModal(true)}>
                  <Icon name="calendar-plus" size={20} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={globalStyles.iconButton}
                  onPress={() => setOpenTerminateModal(true)}>
                  <Icon name="clipboard-remove-outline" size={20} />
                </TouchableOpacity>
              </>
            )}
        </View>
      </CardTitleWithSharp>

      {/* contract information */}
      <View style={{paddingHorizontal: 8, paddingVertical: 8, rowGap: 8}}>
        <View
          style={{
            minHeight: 100,
            justifyContent: 'center',
            alignItems: contract ? 'flex-start' : 'center',
            rowGap: 8,
          }}>
          {contract ? (
            <>
              <InfoTypo
                containerStyle={{
                  ...(globalStyles.borderInfoStyle as any),
                  alignSelf: 'stretch',
                }}
                contentStyle={{textAlign: 'center'}}
                title={t('label.contractPeriod')}>
                {`${moment(contract.startDate).format(DATE_FORMAT)} - ${moment(
                  contract.endDate,
                ).format(DATE_FORMAT)}`}
              </InfoTypo>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignSelf: 'stretch',
                }}>
                <InfoTypo
                  title={t(`label.deposit`)}
                  containerStyle={cardInfoStyle}>
                  {formatPrice(contract.tenancyDeposit || 0) + ' ₫'}
                </InfoTypo>
                <InfoTypo
                  title={t(`room.currentTenant`)}
                  containerStyle={cardInfoStyle}>
                  {contract.tenants ? contract.tenants.length : 0}
                </InfoTypo>
              </View>
              {!minimal && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignSelf: 'stretch',
                  }}>
                  <InfoTypo
                    title={t(`label.status`)}
                    containerStyle={cardInfoStyle}>
                    {t(`state.contract.${contract.state}`)}
                  </InfoTypo>
                  <InfoTypo
                    title={t(`label.createdAt`)}
                    containerStyle={cardInfoStyle}>
                    {`${moment(contract.createdAt).format(DATE_FORMAT)}`}
                  </InfoTypo>
                </View>
              )}
              {(contract.state === ContractStateEnum.EXPIRED ||
                contract.state === ContractStateEnum.TERMINATED) && (
                <>
                  <View style={{width: '100%'}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        columnGap: 8,
                        borderTopWidth: 0.5,
                        borderBottomWidth: 0.5,
                        borderColor: appColors.gray3,
                        paddingVertical: 4,
                      }}>
                      <Icon
                        name={
                          contract.isRefundDeposit
                            ? 'checkbox-marked'
                            : 'checkbox-blank-outline'
                        }
                        size={20}
                        color={
                          contract.isRefundDeposit
                            ? appColors.primary
                            : undefined
                        }
                      />
                      <TextComponent>
                        {t('label.refundedDeposit')}
                      </TextComponent>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        columnGap: 8,
                        borderTopWidth: 0.5,
                        borderBottomWidth: 0.5,
                        borderColor: appColors.gray3,
                        paddingVertical: 4,
                      }}>
                      <Icon
                        name={
                          contract.isCheckedProperties
                            ? 'checkbox-marked'
                            : 'checkbox-blank-outline'
                        }
                        size={20}
                        color={
                          contract.isCheckedProperties
                            ? appColors.primary
                            : undefined
                        }
                      />
                      <TextComponent>
                        {t('label.checkedProperties')}
                      </TextComponent>
                    </View>
                  </View>
                </>
              )}
            </>
          ) : loading ? (
            <ActivityIndicator size={30} color={appColors.primary} />
          ) : (
            <TextComponent>{t('label.emptyRoom')}</TextComponent>
          )}
        </View>
      </View>
      {contract && (
        <>
          <ExtendContractModal
            open={openExtendModal}
            setOpen={setOpenExtendModal}
            contract={contract}
            setContract={setContract}
            setReload={setReloadContractFlag}
          />
          <TerminateContractModal
            open={openTerminateModal}
            setOpen={setOpenTerminateModal}
            contract={contract}
            setContract={setContract}
          />
        </>
      )}
      <PdfPopup
        url={contract?.templateUrl}
        open={openPdf}
        setOpen={setOpenPdf}
      />
    </View>
  );
};

const cardInfoStyle: StyleProp<ViewStyle> = {
  width: '49%',
  ...(globalStyles.borderInfoStyle as any),
};

export default ContractInfoCard;
