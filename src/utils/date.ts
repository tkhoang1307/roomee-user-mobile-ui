import moment from 'moment';

export const convertDDMMYYYtoDate = (str: string, token = '/') => {
  var parts = str.split(token);
  var day = parseInt(parts[0], 10);
  var month = parseInt(parts[1], 10) - 1; // Months are zero-indexed (January is 0)
  var year = parseInt(parts[2], 10);

  // Create the Date object
  var dateObject = new Date(year, month, day) || new Date();
  return dateObject;
};

export const formatDay = (date: string) => {
  const momentDate = moment(date); // Parse the date string into a moment object

  if (momentDate.isSame(moment(), 'day')) {
    return `Today`;
  } else if (momentDate.isAfter(moment().subtract(1, 'week'))) {
    return momentDate.fromNow();
  } else {
    return momentDate.format('MMM DD, YYYY');
  }
};
