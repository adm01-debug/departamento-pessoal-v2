import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WorkflowAprovacaoFerias } from '@/components/ferias/WorkflowAprovacaoFerias';
describe('WorkflowAprovacaoFerias', () => { it('renderiza workflow', () => { render(<WorkflowAprovacaoFerias onApprove={vi.fn()} onReject={vi.fn()} />); expect(screen.getByText(/aprovar/i)).toBeInTheDocument(); }); it('executa aprovar', () => { const onApprove = vi.fn(); render(<WorkflowAprovacaoFerias onApprove={onApprove} onReject={vi.fn()} />); fireEvent.click(screen.getByText(/aprovar/i)); expect(onApprove).toHaveBeenCalled(); }); });
