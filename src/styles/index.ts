import {StyleSheet} from 'react-native';

import {appColors} from '../const/appColors';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.backgroundDefault,
  },

  button: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: appColors.white,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 54,
    flexDirection: 'row',
  },
  buttonAction: {
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: appColors.text,
    paddingHorizontal: 16,
    paddingVertical: 6,
    height: 56,
    flexDirection: 'row',
  },
  shadow: {
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },

  section: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3D56F0',
    width: 30,
    height: 30,
    borderRadius: 100,
  },

  tag: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: appColors.white,
    borderRadius: 100,
    marginRight: 12,
  },

  card: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: appColors.white,
    marginBottom: 24,
  },

  TochableLanguageDefault: {
    width: 80,
    height: 40,
    borderRadius: 4,
    borderWidth: 0.5,
    marginTop: 0,
    alignSelf: 'flex-end',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  TochableLanguageSelect: {
    width: '100%',
    alignSelf: 'center',
    height: 40,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  ImageLanguage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  ViewSelectLanguage: {
    marginTop: 2,
    flexDirection: 'column',
    height: 50,
    alignSelf: 'flex-end',
    width: 80,
    minHeight: 80,
    // backgroundColor: '#fff',
    borderRadius: 10,
  },
  textContent: {
    fontSize: 16,
  },
  textTitle: {
    fontSize: 28,
  },
  textHeading: {
    fontSize: 18,
    color: appColors.text,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: appColors.gray3,
    width: '100%',
    minHeight: 56,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: appColors.white,
    marginBottom: 19,
  },
  borderInfoStyle: {
    borderRadius: 4,
    borderColor: appColors.gray2,
    padding: 4,
    borderWidth: 1,
  },
  cardInfo: {
    backgroundColor: appColors.backgroundCard,
    borderRadius: 4,
  },
  iconButton: {
    height: 40,
    width: 40,
    borderRadius: 40,
    justifyContent: 'center',
    borderColor: appColors.gray,
    borderWidth: 0.5,
    alignItems: 'center',
  },
  closePopupButton: {
    borderBottomEndRadius: 0,
    borderBottomStartRadius: 0,
  },
  menuPopupButton: {
    borderRadius: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
  },
  InfoContainer: {
    flexDirection: 'row',
    columnGap: 4,
    alignItems: 'center',
    flex: 1,
  },
});
