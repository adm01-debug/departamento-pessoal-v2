import { Kbd } from './Kbd';
interface ShortcutProps { keys: string[]; className?: string; }
export function Shortcut({ keys, className }: ShortcutProps) {
  return <span className={`inline-flex items-center gap-0.5 ${className}`}>{keys.map((key, i) => <Kbd key={i}>{key}</Kbd>)}</span>;
}
