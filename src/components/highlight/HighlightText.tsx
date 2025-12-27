interface HighlightTextProps { text: string; highlight: string; className?: string; highlightClassName?: string; }
export function HighlightText({ text, highlight, className, highlightClassName = 'bg-yellow-200' }: HighlightTextProps) {
  if (!highlight.trim()) return <span className={className}>{text}</span>;
  const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (<span className={className}>{parts.map((part, i) => regex.test(part) ? <mark key={i} className={highlightClassName}>{part}</mark> : part)}</span>);
}
