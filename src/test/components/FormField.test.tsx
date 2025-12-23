import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormField } from '@/components/form/FormField';
import { Input } from '@/components/ui/input';

describe('FormField', () => {
  it('deve renderizar label', () => {
    render(<FormField label="Nome"><Input /></FormField>);
    expect(screen.getByText('Nome')).toBeInTheDocument();
  });
  it('deve mostrar asterisco quando required', () => {
    render(<FormField label="Nome" required><Input /></FormField>);
    expect(screen.getByText('*')).toBeInTheDocument();
  });
  it('deve mostrar erro', () => {
    render(<FormField label="Nome" error="Campo obrigatório"><Input /></FormField>);
    expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();
  });
  it('deve mostrar hint quando não há erro', () => {
    render(<FormField label="Nome" hint="Informe seu nome completo"><Input /></FormField>);
    expect(screen.getByText('Informe seu nome completo')).toBeInTheDocument();
  });
});
