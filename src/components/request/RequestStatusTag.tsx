import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {appColors} from '@const/appColors';
import {RequestStatus} from '@models/request';
import TextComponent from '@components/TextComponent';

interface RequestStatusTagProps {
  status: RequestStatus;
}

const RequestStatusTag: React.FC<RequestStatusTagProps> = ({status}) => {
  const {t} = useTranslation();
  const TagColor = () => {
    switch (status) {
      case RequestStatus.CREATED:
        return appColors.warning;
      case RequestStatus.SCHEDULED:
        return '#08b3d6';
      case RequestStatus.AWAITING_BOOKING:
        return '#dc6b08';
      case RequestStatus.PROCESSING:
        return appColors.info;
      case RequestStatus.COMPLETED:
        return appColors.success;
      case RequestStatus.CANCELED:
        return appColors.danger;
      default:
        return appColors.black;
    }
  };
  const TagBackgroundColor = () => {
    switch (status) {
      case RequestStatus.CREATED:
        return appColors.warningBackground;
      case RequestStatus.AWAITING_BOOKING:
        return '#fff7e6';
      case RequestStatus.SCHEDULED:
        return '#e6fffb';
      case RequestStatus.PROCESSING:
        return appColors.infoBackground;
      case RequestStatus.COMPLETED:
        return appColors.successBackground;
      case RequestStatus.CANCELED:
        return appColors.dangerBackground;
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
        {t(`request.status.${status.toLowerCase()}`)}
      </TextComponent>
    </View>
  );
};

export default RequestStatusTag;
