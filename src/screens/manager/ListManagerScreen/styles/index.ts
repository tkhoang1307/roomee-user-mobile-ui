import {appColors} from '@const/appColors';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.white,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginTop: 12,
  },
  tagAndToggleGroupStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  containerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonItemCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const SwitchButtonStyles = StyleSheet.create({
  switchContainer: {
    transform: [{scaleX: 0.9}, {scaleY: 0.9}],
  },
  switch: {},
  toggleClosedStyle: {
    backgroundColor: '#ff4d4f',
  },
  toggleCheckStyle: {
    backgroundColor: '#52c41a',
  },
  tagAndToggleGroupStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
});
