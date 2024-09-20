import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {appColors} from '@const/appColors';
import {ContractStateEnum} from '@const/contract';
import TextComponent from '@components/TextComponent';

interface RequestStatusTagProps {
  status: ContractStateEnum;
}

const ContractStatusTag: React.FC<RequestStatusTagProps> = ({status}) => {
  const {t} = useTranslation();
  const TagColor = () => {
    switch (status) {
      case ContractStateEnum.TERMINATED:
        return appColors.warning;
      case ContractStateEnum.PROCESSING || ContractStateEnum.CREATED:
        return appColors.info;
      case ContractStateEnum.COMPLETED:
        return appColors.success;
      case ContractStateEnum.FAILED:
        return appColors.danger;
      case ContractStateEnum.EXPIRED:
        return appColors.black;
      default:
        return appColors.black;
    }
  };
  const TagBackgroundColor = () => {
    switch (status) {
      case ContractStateEnum.TERMINATED:
        return appColors.warningBackground;
      case ContractStateEnum.PROCESSING || ContractStateEnum.CREATED:
        return appColors.infoBackground;
      case ContractStateEnum.COMPLETED:
        return appColors.successBackground;
      case ContractStateEnum.FAILED:
        return appColors.dangerBackground;
      case ContractStateEnum.EXPIRED:
        return appColors.gray5;
      default:
        return appColors.white;
    }
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 4,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: TagColor(),
        padding: 4,
        backgroundColor: TagBackgroundColor(),
      }}>
      <Icon name="tag-outline" size={15} color={TagColor()} />
      <TextComponent color={TagColor()}>
        {t(`state.contract.${status.toUpperCase()}`)}
      </TextComponent>
    </View>
  );
};

export default ContractStatusTag;
