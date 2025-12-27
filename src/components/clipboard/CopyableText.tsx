import { CopyButton } from './CopyButton';
interface CopyableTextProps { text: string; className?: string; }
export function CopyableText({ text, className }: CopyableTextProps) {
  return <span className={`inline-flex items-center gap-1 ${className}`}><span className="font-mono text-sm">{text}</span><CopyButton text={text} /></span>;
}
