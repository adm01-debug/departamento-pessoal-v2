interface FileSizeProps { bytes: number; className?: string; }
export function FileSize({ bytes, className }: FileSizeProps) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes, unit = 0;
  while (size >= 1024 && unit < units.length - 1) { size /= 1024; unit++; }
  return <span className={className}>{size.toFixed(1)} {units[unit]}</span>;
}
