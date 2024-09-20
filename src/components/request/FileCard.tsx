import {useMemo, useState} from 'react';
import RNFetchBlob, {RNFetchBlobConfig} from 'rn-fetch-blob';
import {TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {globalStyles} from '@styles';
import {appColors} from '@const/appColors';
import TextComponent from '@components/TextComponent';
import {extractFileName} from '@utils/stringHelpers';
import {useTranslation} from 'react-i18next';
import {Modal} from '@ant-design/react-native';

interface FileCardProps {
  source: string;
}

const FileCard: React.FC<FileCardProps> = ({source}) => {
  const {t} = useTranslation();
  const fileName = useMemo(() => extractFileName(source), [source]);
  const [open, setOpen] = useState(false);

  const onClickFile = async () => {
    // console.log(await isGranted());
    // if (!(await isGranted())) {
    //   await requestStoragePermission();
    //   if (!(await isGranted())) {
    //     return;
    //   }
    // }
    const {config, fs} = RNFetchBlob;
    let downloadDir = fs.dirs.DownloadDir; // this is the pictures directory. You can check the available directories in the wiki.
    let options: RNFetchBlobConfig = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
        notification: false,
        path: downloadDir + '/' + fileName, // this is the path where your downloaded file will live in
        description: t('request.download'),
      },
    };
    config(options)
      .fetch('GET', source)
      .then(_res => {
        // do some magic here
        // console.log('res: ', res);
      })
      .catch(err => console.log('Download err: ', err));
  };

  return (
    <>
      <TouchableOpacity onPress={() => setOpen(true)}>
        <View
          style={[
            globalStyles.cardInfo,
            globalStyles.borderInfoStyle,
            {padding: 8, flexDirection: 'row'},
          ]}>
          <Icon name={'paperclip'} color={appColors.gray} size={20} />
          <View>
            <TextComponent
              styles={{textDecorationLine: 'underline', maxWidth: 290}}
              color={appColors.info}>
              {fileName}
            </TextComponent>
          </View>
        </View>
      </TouchableOpacity>
      <Modal
        transparent
        onClose={() => setOpen(false)}
        visible={open}
        maskClosable
        footer={[
          {
            text: t('actions.cancel'),
            onPress: () => {},
            style: {color: appColors.black},
          },
          {text: t('actions.ok'), onPress: () => onClickFile()},
        ]}>
        <View style={{paddingVertical: 4, alignItems: 'center'}}>
          <TextComponent size={20}>{t('request.download') + '?'}</TextComponent>
        </View>
      </Modal>
    </>
  );
};

export default FileCard;
