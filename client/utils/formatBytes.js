export const formatBytes = (bytes = 0) => {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const index = Math.floor(
    Math.log(bytes) / Math.log(1024)
  );

  const size = bytes / Math.pow(1024, index);

  return `${size.toFixed(2)} ${units[index]}`;
};
