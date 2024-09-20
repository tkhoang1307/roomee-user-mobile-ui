import {TouchableOpacity, View} from 'react-native';
import {DocumentPickerResponse} from 'react-native-document-picker';

import TextComponent from './TextComponent';
import {globalStyles} from '@styles';
import {appColors} from '@const/appColors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Dispatch, SetStateAction} from 'react';

interface FileUploadCardProps {
  file: DocumentPickerResponse;
  setSelectedFiles: Dispatch<SetStateAction<DocumentPickerResponse[]>>;
  download?: boolean;
  remove?: boolean;
}

const FileUploadCard: React.FC<FileUploadCardProps> = ({
  file,
  setSelectedFiles,
}) => {
  return (
    <View
      style={[
        globalStyles.cardInfo,
        globalStyles.borderInfoStyle,
        {padding: 8, flexDirection: 'row'},
      ]}>
      <TouchableOpacity
        onPress={() => {
          setSelectedFiles(prev => prev.filter(i => i.uri !== file.uri));
        }}
        style={{
          position: 'absolute',
          right: -10,
          top: -10,
          height: 20,
          width: 20,
          borderRadius: 10,
          backgroundColor: 'rgba(57, 52, 52, 0.8)',
          zIndex: 100000000,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon name="close" size={20} color={appColors.white} />
      </TouchableOpacity>
      <Icon name={'paperclip'} color={appColors.gray} size={20} />
      <View>
        <TextComponent
          styles={{textDecorationLine: 'underline', maxWidth: 300}}
          color={appColors.info}>
          {file.name}
        </TextComponent>
      </View>
    </View>
  );
};

export default FileUploadCard;
