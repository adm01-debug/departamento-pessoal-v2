export const getFileExtension = (filename: string) => filename.split('.').pop()?.toLowerCase() || '';
export const getFileName = (path: string) => path.split('/').pop() || '';
export const formatFileSize = (bytes: number) => { const units = ['B', 'KB', 'MB', 'GB']; let i = 0; while (bytes >= 1024 && i < units.length - 1) { bytes /= 1024; i++; } return `${bytes.toFixed(1)} ${units[i]}`; };
export const isImage = (filename: string) => ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(getFileExtension(filename));
export const isPdf = (filename: string) => getFileExtension(filename) === 'pdf';
