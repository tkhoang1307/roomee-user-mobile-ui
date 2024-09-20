import {appColors} from '@const/appColors';
import {Platform, StatusBar, StyleSheet} from 'react-native';

export const HomeStyles = StyleSheet.create({
  radioButtonView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: '100%',
    display: 'flex',
  },
  radioButton: {
    // width: '30%',
    flex: 0.5,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  normalText: {
    fontWeight: 'bold',
    color: appColors.white,
  },
  selectedText: {
    color: appColors.primary,
  },
  selectedRadio: {
    borderColor: appColors.primary,
  },
  errorRadio: {
    borderColor: appColors.danger,
  },
  innerCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: 'blue',
  },
  viewHeaderBarStyle: {
    position: 'relative',
    backgroundColor: '#faad14',

    // height: Platform.OS === 'android' ? 180 : 182,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 52,
    overflow: 'hidden',
  },
  circleFirstStyle: {
    backgroundColor: '#f0a104',
    height: 180,
    width: 180,
    borderRadius: 100,
    position: 'absolute',
    top: -120,
    left: -80,
  },
  circleSecondStyle: {
    backgroundColor: appColors.primaryLight,
    height: 40,
    width: 40,
    borderRadius: 100,
    position: 'absolute',
    top: -20,
    left: 40,
  },
  textTileStyle: {
    textAlign: 'center',
    fontSize: 20,
  },
});

export const CardAccomStyles = StyleSheet.create({
  imageAvatarStyle: {
    flex: 1,
    marginBottom: 12,
    height: 131,
    padding: 10,
    position: 'relative',
    objectFit: 'contain',
  },
  borderCornerFirstStyle: {
    height: 25,
    width: 25,
    backgroundColor: appColors.primary,
    position: 'absolute',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    borderTopLeftRadius: 5,
  },
  borderCornerSecondStyle: {
    height: 25,
    width: 25,
    backgroundColor: appColors.primary,
    position: 'absolute',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderBottomRightRadius: 5,
    bottom: 50,
    right: 0,
  },
  backgroundCornerStyle: {
    height: 20,
    width: 20,
    backgroundColor: appColors.backgroundCard,
  },
});

export const AllCardAccomStyles = StyleSheet.create({
  sectionAllCardStyle: {
    paddingHorizontal: 28,
    paddingTop: 10,
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 22 : 10,
  },
});
