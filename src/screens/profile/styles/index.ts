// import { appColors } from '@const/appColors';
import {StyleSheet} from 'react-native';

export const ProfileScreenStyles = StyleSheet.create({
  rowHeadingStyle: {
    flex: 2,
    height: '100%',
  },
  imageStyle: {
    width: 80,
    height: 80,
    borderRadius: 40,
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

export const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    marginTop: 16,
    borderRadius: 12,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    marginTop: 16,
    borderRadius: 12,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
