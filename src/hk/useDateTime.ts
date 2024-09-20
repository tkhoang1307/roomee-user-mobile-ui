import moment from 'moment';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

const useDateTime = (date: string) => {
  const {t, i18n} = useTranslation();
  const [timeFromNow, setTimeFromNow] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const locale = i18n.language;

      moment.locale(locale);
      const momentDate = moment(date); // Parse the date string into a moment object

      if (momentDate.isSame(moment(), 'day')) {
        setTimeFromNow(t('label.today'));
      } else if (momentDate.isAfter(moment().subtract(1, 'week'))) {
        setTimeFromNow(momentDate.fromNow());
      } else {
        setTimeFromNow(momentDate.format('L'));
      }
    };

    updateTime();
    const intervalId = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, [date, t, i18n.language]);

  return {
    timeFromNow,
  };
};

export default useDateTime;
