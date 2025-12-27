import { FileCard } from './FileCard';
interface FileListProps { files: { name: string; size: number }[]; onRemove?: (index: number) => void; }
export function FileList({ files, onRemove }: FileListProps) {
  if (files.length === 0) return null;
  return (<div className="space-y-2">{files.map((f, i) => <FileCard key={i} file={f} onRemove={onRemove ? () => onRemove(i) : undefined} />)}</div>);
}
