export function convertDateFormatDDMMYYYToYYYYMMDD(inputDate: string) {
  // Chuyển đổi ngày từ "DD/MM/YYYY" sang "YYYY-MM-DD"
  const parts = inputDate.split('/');
  const formattedDate = `${parts[2]}-${parts[1].padStart(
    2,
    '0',
  )}-${parts[0].padStart(2, '0')}`;
  return formattedDate;
}

export function convertDateFormatYYYYMMDDToDDMMYYY(inputDate: string) {
  const parts = inputDate.split('-');
  const formattedDate = `${parts[2].padStart(2, '0')}/${parts[1].padStart(
    2,
    '0',
  )}/${parts[0]}`;
  return formattedDate;
}

export function convertToTimestamp(dateString: string) {
  const dateObject = new Date(dateString);
  const timestamp = Math.floor(dateObject.getTime() / 1000);
  return timestamp;
}

export function convertTimestampToDate(timestamp: number) {
  const timestampMilliseconds = timestamp * 1000;
  // const hanoiDate = new Date(timestampMilliseconds).toLocaleString('en-US', { timeZone: hanoiTimezone });
  const date = new Date(timestampMilliseconds);

  // Get day, month, and year
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-based, so add 1
  const year = date.getFullYear();

  // Format the date as "DD/MM/YYYY"
  const dateString = `${day}/${month}/${year}`;

  return dateString;
}

export function formatVietnamDate(utcDateString: string) {
  if (utcDateString) {
    const utcDate = new Date(utcDateString);
    const vietnamDate = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }).format(utcDate);

    return vietnamDate;
  }
  return '';
}

export function convertDatetimeToDDMMYYYY(date: Date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function formatDatetimeToHHMMSSDDMMYYYY(
  datetimeString: string,
  includeTime: boolean = true,
): string {
  const date = new Date(datetimeString);

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear().toString();
  let formattedDatetime = `${day}/${month}/${year}`;

  if (includeTime) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    formattedDatetime = `${hours}:${minutes}:${seconds} - ` + formattedDatetime;
  }

  return formattedDatetime;
}

export function formatDatetimeToDDMMYYYY(dateTimeString: string) {
  const dateTime = new Date(dateTimeString);

  const day = dateTime.getUTCDate();
  const month = dateTime.getUTCMonth() + 1;
  const year = dateTime.getUTCFullYear();

  const formattedDate = `${day < 10 ? '0' : ''}${day}/${
    month < 10 ? '0' : ''
  }${month}/${year}`;
  return formattedDate;
}

export function convertDatetimeToMMYYYY(date: Date) {
  //const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${month}/${year}`;
}

export function isoToDDMMYYYY(isoString: string) {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
  const day = String(date.getDate()).padStart(2, '0'); // Add leading zero for single-digit days

  return `${day}/${month}/${year}`;
}
