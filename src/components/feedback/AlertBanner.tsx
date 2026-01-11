// V15-494
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface AlertBannerProps { variant: 'info' | 'success' | 'warning' | 'error'; title: string; description?: string; onDismiss?: () => void; }
const icons = { info: Info, success: CheckCircle, warning: AlertTriangle, error: AlertCircle };
const styles = { info: 'border-blue-500 bg-blue-50', success: 'border-green-500 bg-green-50', warning: 'border-yellow-500 bg-yellow-50', error: 'border-red-500 bg-red-50' };
export function AlertBanner({ variant, title, description, onDismiss }: AlertBannerProps) {
  const Icon = icons[variant];
  return (<Alert className={styles[variant]}><Icon className="h-4 w-4" /><AlertTitle className="flex items-center justify-between">{title}{onDismiss && <Button variant="ghost" size="sm" onClick={onDismiss}><X className="h-4 w-4" /></Button>}</AlertTitle>{description && <AlertDescription>{description}</AlertDescription>}</Alert>);
}
