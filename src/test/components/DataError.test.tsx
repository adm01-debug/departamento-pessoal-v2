import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DataError } from '@/components/data/DataError';
describe('DataError', () => { it('renderiza erro', () => { render(<DataError message="Erro ao carregar" />); expect(screen.getByText('Erro ao carregar')).toBeInTheDocument(); }); it('exibe botão retry', () => { render(<DataError message="Erro" onRetry={() => {}} />); expect(screen.getByText(/tentar novamente/i)).toBeInTheDocument(); }); });
