import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ExportacaoContabil } from '@/components/contabil/ExportacaoContabil';
describe('ExportacaoContabil', () => { it('renderiza exportação', () => { render(<ExportacaoContabil onExport={vi.fn()} />); expect(screen.getByText(/contábil/i)).toBeInTheDocument(); }); });
