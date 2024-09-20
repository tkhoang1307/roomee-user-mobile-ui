import {Dimensions, StyleSheet} from 'react-native';

import {appColors} from '@const/appColors';
import {fontFamilies} from '@const/fontFamilies';

export const ServiceStepStyle = StyleSheet.create({
  textOverlaySecondServiceStyle: {
    fontSize: 16,
    width: 120,
    textAlignVertical: 'center',
    paddingLeft: 10,
    height: 40,
  },
  serviceViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  unitContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    width: '100%',
    minHeight: 56,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: appColors.white,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 24,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
  },
  button: {
    borderRadius: 12,
    padding: 10,
    elevation: 2,
    marginTop: 20,
  },
  buttonClose: {
    backgroundColor: appColors.primary,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export const UnitCompStyle = StyleSheet.create({
  itemNullableStyle: {
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTextStyle: {
    fontSize: 16,
    width: 120,
    textAlignVertical: 'center',
    paddingLeft: 10,
    height: 40,
  },
  unitContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    width: '100%',
    minHeight: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: appColors.white,
  },
  textStringTypeStyle: {
    fontFamily: fontFamilies.bold,
    textAlign: 'center',
  },
});

export const AddAccommodationStyle = StyleSheet.create({
  sectionTitleStyle: {
    backgroundColor: appColors.secondary,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  titleStyle: {
    color: appColors.white,
    textAlign: 'center',
    textAlignVertical: 'top',
    paddingBottom: 4,
  },
  sectionStepStyle: {
    backgroundColor: appColors.white2,
    paddingTop: 20,
  },
  viewStepStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  viewActionStyleFirstStep: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 10,
    width: '100%',
  },
  viewActionStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '100%',
    marginBottom: 10,
  },
  buttonPreviousStyle: {
    width: Dimensions.get('window').width * 0.45,
    height: 50,
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: appColors.white,
  },
  buttonNextStyleFirstStep: {
    width: '100%',
    height: 50,
    paddingTop: 0,
    paddingBottom: 0,
    marginBottom: 0,
  },
  buttonNextStyle: {
    width: '80%',
    height: 50,
    paddingTop: 0,
    paddingBottom: 0,
  },
  buttonAddStyle: {
    width: Dimensions.get('window').width * 0.45,
    height: 50,
    paddingTop: 0,
    paddingBottom: 0,
  },
});
