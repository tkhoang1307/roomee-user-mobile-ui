import {StyleSheet} from 'react-native';

export const AllRoomStyles = StyleSheet.create({
  modalizeStyle: {marginTop: 20, paddingHorizontal: 20, marginBottom: 10},
  overlayModal: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
