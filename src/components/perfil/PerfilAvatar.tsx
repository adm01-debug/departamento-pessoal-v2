import { memo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
interface PerfilAvatarProps { nome: string; foto?: string; onUpload?: () => void; size?: 'sm' | 'md' | 'lg'; }
const sizes = { sm: 'h-16 w-16', md: 'h-24 w-24', lg: 'h-32 w-32' };
export const PerfilAvatar = memo(function PerfilAvatar({ nome, foto, onUpload, size = 'md' }: PerfilAvatarProps) {
  return (
    <div className="relative inline-block">
      <Avatar className={sizes[size]}>{foto && <AvatarImage src={foto} />}<AvatarFallback className="text-lg">{nome.slice(0,2).toUpperCase()}</AvatarFallback></Avatar>
      {onUpload && <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 h-8 w-8 rounded-full" onClick={onUpload}><Camera className="h-4 w-4" /></Button>}
    </div>
  );
});
