import numeral from 'numeral';

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  const k = 1024;
  const sizes = ['KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = (bytes / Math.pow(k, i)).toFixed(2);
  return `${value} ${sizes[i - 1]}`;
};
export function fData(number: number | string) {
  return numeral(number).format('0.0 b');
}
