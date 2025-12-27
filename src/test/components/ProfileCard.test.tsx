import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProfileCard } from '@/components/perfil/ProfileCard';
const mockProfile = { nome: 'João', cargo: 'Dev', email: 'joao@test.com' };
describe('ProfileCard', () => { it('renderiza perfil', () => { render(<ProfileCard profile={mockProfile} />); expect(screen.getByText('João')).toBeInTheDocument(); expect(screen.getByText('Dev')).toBeInTheDocument(); }); });
