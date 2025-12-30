import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';

interface ColaboradorContactInfoProps {
  email?: string;
  telefone?: string;
  celular?: string;
  endereco?: string;
  className?: string;
}

export const ColaboradorContactInfo = memo(function ColaboradorContactInfo({ 
  email,
  telefone,
  celular,
  endereco,
  className 
}: ColaboradorContactInfoProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Informações de Contato</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {email && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{email}</span>
          </div>
        )}
        {telefone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{telefone}</span>
          </div>
        )}
        {celular && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{celular}</span>
          </div>
        )}
        {endereco && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{endereco}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

export default ColaboradorContactInfo;
