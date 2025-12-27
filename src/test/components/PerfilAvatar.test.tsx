import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PerfilAvatar } from '@/components/perfil/PerfilAvatar';
describe('PerfilAvatar', () => { it('renderiza avatar', () => { render(<PerfilAvatar nome="João Silva" />); expect(screen.getByText('JS')).toBeInTheDocument(); }); it('exibe imagem', () => { render(<PerfilAvatar nome="João" imageUrl="test.jpg" />); expect(screen.getByRole('img')).toBeInTheDocument(); }); });
