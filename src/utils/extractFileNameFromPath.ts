export const extractFileNameFromPath = (path: string): string => {
  const extractedUrlAndParams = path.split('?');
  const Url = extractedUrlAndParams[0];
  const rawFileName = Url.split('/').pop()!;

  const decodedFileName = decodeURIComponent(rawFileName);
  return decodedFileName;
};
