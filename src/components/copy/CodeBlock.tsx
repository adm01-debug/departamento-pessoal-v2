import { CopyButton } from './CopyButton';
interface CodeBlockProps { code: string; language?: string; className?: string; }
export function CodeBlock({ code, language = 'text', className }: CodeBlockProps) {
  return (<div className={`relative group ${className}`}><pre className="bg-muted p-4 rounded-lg overflow-x-auto"><code className={`language-${language} text-sm`}>{code}</code></pre><div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"><CopyButton text={code} /></div></div>);
}
