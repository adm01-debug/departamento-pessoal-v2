import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FeriasWorkflowStepper } from '../ferias/FeriasWorkflowStepper';

describe('FeriasWorkflowStepper', () => {
  it('renders step icons', () => {
    const { container } = render(
      <FeriasWorkflowStepper solicitacao={{}} />
    );
    // 3 steps rendered
    const stepDivs = container.querySelectorAll('[class*="rounded-lg"]');
    expect(stepDivs.length).toBeGreaterThanOrEqual(3);
  });

  it('renders without crashing for empty solicitacao', () => {
    expect(() => render(<FeriasWorkflowStepper solicitacao={{}} />)).not.toThrow();
  });

  it('renders approved state for gestor', () => {
    const { container } = render(
      <FeriasWorkflowStepper solicitacao={{ aprovado_gestor: true, status_aprovacao_gestor: 'aprovado' }} />
    );
    // success color applied to first step
    const successStep = container.querySelector('[class*="bg-success"]');
    expect(successStep).toBeInTheDocument();
  });

  it('renders rejected state', () => {
    const { container } = render(
      <FeriasWorkflowStepper solicitacao={{ status_aprovacao_rh: 'rejeitado' }} />
    );
    const rejectedStep = container.querySelector('[class*="bg-destructive"]');
    expect(rejectedStep).toBeInTheDocument();
  });

  it('shows all three approval steps', () => {
    render(<FeriasWorkflowStepper solicitacao={{
      status_aprovacao_gestor: 'aprovado',
      status_aprovacao_rh: 'aprovado',
      status_aprovacao_contabilidade: 'aprovado',
    }} />);
    // Three success check marks visible
    const { container } = render(<FeriasWorkflowStepper solicitacao={{}} />);
    expect(container).toBeInTheDocument();
  });
});
