import { Tag } from './Tag';
interface TagListProps { tags: string[]; onRemove?: (index: number) => void; max?: number; }
export function TagList({ tags, onRemove, max }: TagListProps) {
  const visible = max ? tags.slice(0, max) : tags;
  const remaining = max ? tags.length - max : 0;
  return (<div className="flex flex-wrap gap-1">{visible.map((t, i) => <Tag key={i} label={t} onRemove={onRemove ? () => onRemove(i) : undefined} />)}{remaining > 0 && <Tag label={`+${remaining}`} variant="secondary" />}</div>);
}
