import {Dimensions, Platform, StatusBar, StyleSheet} from 'react-native';

import {appColors} from '@const/appColors';

export const DetailAccommodationStyle = StyleSheet.create({
  headerBarStyle: {
    position: 'relative',
    backgroundColor: appColors.secondary,
    // height: Platform.OS === 'android' ? 130 : 182,
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
  viewContainerStyle: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAccomStyle: {
    flexDirection: 'column',
    maxWidth: 300,
  },
  textAccomNameStyle: {
    textAlign: 'center',
    fontSize: 20,
    paddingBottom: 6,
  },
  textAdressStyle: {
    textAlign: 'left',
    width: 280,
  },
  modalizeStyle: {marginTop: 30, paddingHorizontal: 20, marginBottom: 10},
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
    backgroundColor: appColors.secondary,
    // height: Platform.OS === 'android' ? 180 : 182,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 52,
    overflow: 'hidden',
  },
});

export const ComponentStyle = StyleSheet.create({
  boxServiceStyles: {
    width: Dimensions.get('window').width * 0.28,
    height: Dimensions.get('window').height * 0.13,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10,
  },
});

export const ModalStyles = StyleSheet.create({
  overlayModal: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
