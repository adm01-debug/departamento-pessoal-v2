import { useState } from 'react';
import { Button } from '@/components/ui/button';
interface TruncateTextProps { text: string; maxLength?: number; className?: string; }
export function TruncateText({ text, maxLength = 100, className }: TruncateTextProps) {
  const [expanded, setExpanded] = useState(false);
  if (text.length <= maxLength) return <span className={className}>{text}</span>;
  return (<span className={className}>{expanded ? text : `${text.slice(0, maxLength)}...`}<Button variant="link" size="sm" onClick={() => setExpanded(!expanded)} className="h-auto p-0 ml-1">{expanded ? 'Ver menos' : 'Ver mais'}</Button></span>);
}
