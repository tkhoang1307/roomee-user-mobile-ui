import {LocationOptionsModel} from '@models/location';

export const FindLabelOfValueInSelectionOptions = (
  arr: Array<LocationOptionsModel>,
  value: string,
) => {
  const curIndex = arr.findIndex(x => x.value === value);
  if (curIndex !== -1) {
    return arr[curIndex].label;
  }
  return '';
};

export const FindValueOfLabelInSelectionOptions = (
  arr: Array<LocationOptionsModel>,
  label: string,
) => {
  const curIndex = arr.findIndex(x => x.label === label);
  if (curIndex !== -1) {
    return arr[curIndex].value;
  }
  return '';
};
