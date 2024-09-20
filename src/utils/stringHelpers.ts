import {LocationModel} from '@models/accommodation';

export function getNumberWithOrdinal(n: number): string {
  var s = ['th', 'st', 'nd', 'rd'],
    v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export function getAddress(location: LocationModel): string {
  let address = location.street + ', ';
  if (location.ward && location.ward.length > 0) {
    address = address + location.ward + ', ';
  }
  address = address + location.district + ', ';
  address = address + location.cityProvince;
  return address;
}

export function normalizeStr(
  name: string,
  noCapitalizeFirstLetter: boolean = false,
) {
  // Replace newline characters with spaces
  name = name.replace(/\n/g, ' ');

  // Split the name into an array of words
  const words = name.toLowerCase().split(' ');

  if (noCapitalizeFirstLetter) return words.join(' ');

  // Capitalize the first letter of each word
  const normalizedWords = words.map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // Join the normalized words back into a string
  return normalizedWords.join(' ');
}

export function formatPhoneNumber(phoneNumber: string) {
  const cleanedNumber = phoneNumber.replace(/\D/g, '');

  const firstPart = cleanedNumber.slice(0, 4);
  const secondPart = cleanedNumber.slice(4, 7);
  const thirdPart = cleanedNumber.slice(7);

  const formattedNumber = `${firstPart}.${secondPart}.${thirdPart}`;

  return formattedNumber;
}

export function formatPrice(price: number) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatPriceYAxis(price: string) {
  const amount = parseFloat(price);
  // Divide by one million and format to one decimal place
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + 'tr';
  } else if (amount >= 1000) {
    return (amount / 1000).toFixed(1) + 'k';
  } else {
    return amount.toString();
  }
}

export function isImageUrl(url: string) {
  const imageExtensions = [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'bmp',
    'webp',
    'tiff',
    'svg',
  ];
  const extension = (url.split('.').pop() || 'abc?123')
    .split('?')[0]
    .toLowerCase();
  return imageExtensions.includes(extension);
}

export function extractFileName(url: string) {
  // Use regular expressions to decode the URL components
  const decodedUrl = decodeURIComponent(url);

  // Extract the file name from the URL
  const urlParts = decodedUrl.split('/');
  let fileName = urlParts[urlParts.length - 1].split('?')[0];

  // Regular expression to match UUIDs
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-/i;

  // Remove all UUIDs from the beginning of the file name
  while (uuidPattern.test(fileName)) {
    fileName = fileName.replace(uuidPattern, '');
  }

  return fileName;
}
