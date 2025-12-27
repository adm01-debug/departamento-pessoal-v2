import { FileText, Image, File, FileSpreadsheet, FileCode } from 'lucide-react';
const icons: Record<string, any> = { pdf: FileText, doc: FileText, docx: FileText, xls: FileSpreadsheet, xlsx: FileSpreadsheet, jpg: Image, jpeg: Image, png: Image, gif: Image, js: FileCode, ts: FileCode, tsx: FileCode };
interface FileIconProps { filename: string; className?: string; }
export function FileIcon({ filename, className }: FileIconProps) {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const Icon = icons[ext] || File;
  return <Icon className={className} />;
}
