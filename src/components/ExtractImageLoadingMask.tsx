import {appColors} from '@const/appColors';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import TextComponent from './TextComponent';

interface ExtractImageLoadingMaskProps {
  loading?: boolean;
  styles?: StyleProp<ViewStyle>;
}

const ExtractImageLoadingMask: React.FC<ExtractImageLoadingMaskProps> = ({
  loading,
  styles,
}) => {
  const {t} = useTranslation();
  return (
    <>
      {loading ? (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            flexGrow: 1,
            position: 'absolute',
            alignItems: 'center',
            borderRadius: 4,
          }}>
          <View style={[{marginTop: 180}, styles]}>
            <ActivityIndicator size={40} color={appColors.primary} />
            <TextComponent
              styles={{
                color: appColors.primary,
                fontSize: 18,
                textAlign: 'center',
              }}>
              {t('step.extractDataFromImage.start')}
            </TextComponent>
          </View>
        </View>
      ) : undefined}
    </>
  );
};

export default ExtractImageLoadingMask;
