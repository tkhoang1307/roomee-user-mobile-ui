import {Button, Modal} from '@ant-design/react-native';
import {appColors} from '@const/appColors';
import {globalStyles} from '@styles';
import {useTranslation} from 'react-i18next';
import {Dimensions, ScrollView, View} from 'react-native';
import Pdf from 'react-native-pdf';

interface PdfPopupProps {
  url: string | undefined | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PdfPopup: React.FC<PdfPopupProps> = ({url, open, setOpen}) => {
  const {t} = useTranslation();
  return (
    <Modal
      popup
      visible={open}
      maskClosable
      animationType="slide-up"
      onClose={() => setOpen(false)}>
      <ScrollView>
        {url && (
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-start',
              alignItems: 'center',
              borderWidth: 0.5,
              borderColor: appColors.gray2,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
            }}>
            <Pdf
              style={{
                flex: 1,
                width: Dimensions.get('window').width - 40,
                height: Dimensions.get('window').height - 200,
              }}
              trustAllCerts={false}
              source={{
                cache: true,
                uri: url,
              }}
              spacing={4}
            />
          </View>
        )}
      </ScrollView>
      <Button
        type="primary"
        style={globalStyles.closePopupButton}
        onPress={() => setOpen(false)}>
        {t('actions.close')}
      </Button>
    </Modal>
  );
};

export default PdfPopup;
