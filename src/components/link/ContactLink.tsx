import { Mail, Phone } from 'lucide-react';
interface ContactLinkProps { type: 'email' | 'phone'; value: string; className?: string; }
export function ContactLink({ type, value, className }: ContactLinkProps) {
  const href = type === 'email' ? `mailto:${value}` : `tel:${value}`;
  const Icon = type === 'email' ? Mail : Phone;
  return <a href={href} className={`inline-flex items-center gap-1 text-primary hover:underline ${className}`}><Icon className="h-4 w-4" />{value}</a>;
}
