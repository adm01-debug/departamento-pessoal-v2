import { memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ResetPasswordFormProps {
  onSubmit?: (email: string) => void;
  className?: string;
}

export const ResetPasswordForm = memo(function ResetPasswordForm({ onSubmit, className }: ResetPasswordFormProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(email);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recuperar Senha</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <Button type="submit" className="w-full">Enviar Link de Recuperação</Button>
        </form>
      </CardContent>
    </Card>
  );
});

export default ResetPasswordForm;
