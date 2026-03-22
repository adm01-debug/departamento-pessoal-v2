import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DesligamentoChecklist, CHECKLIST_ITEMS } from '../DesligamentoChecklist';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, onClick, disabled, className, ...props }: any) => (
      <button onClick={onClick} disabled={disabled} className={className}>{children}</button>
    ),
  },
}));

describe('DesligamentoChecklist', () => {
  const emptyDesligamento: Record<string, any> = {};
  const fullDesligamento: Record<string, any> = {};
  CHECKLIST_ITEMS.forEach((item) => {
    emptyDesligamento[item.key] = false;
    fullDesligamento[item.key] = true;
  });

  it('renders all 8 checklist items', () => {
    render(<DesligamentoChecklist desligamento={emptyDesligamento} />);
    CHECKLIST_ITEMS.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });

  it('shows 0/8 progress when empty', () => {
    render(<DesligamentoChecklist desligamento={emptyDesligamento} />);
    expect(screen.getByText('0/8')).toBeInTheDocument();
  });

  it('shows 8/8 progress when full', () => {
    render(<DesligamentoChecklist desligamento={fullDesligamento} />);
    expect(screen.getByText('8/8')).toBeInTheDocument();
  });

  it('shows partial progress', () => {
    const partial = { ...emptyDesligamento, checklist_comunicacao: true, checklist_documentacao: true };
    render(<DesligamentoChecklist desligamento={partial} />);
    expect(screen.getByText('2/8')).toBeInTheDocument();
  });

  it('calls onToggle when clicking an item', () => {
    const onToggle = vi.fn();
    render(<DesligamentoChecklist desligamento={emptyDesligamento} onToggle={onToggle} />);
    fireEvent.click(screen.getByText('Comunicação ao colaborador'));
    expect(onToggle).toHaveBeenCalledWith('checklist_comunicacao', true);
  });

  it('does not call onToggle in readOnly mode', () => {
    const onToggle = vi.fn();
    render(<DesligamentoChecklist desligamento={emptyDesligamento} onToggle={onToggle} readOnly />);
    const button = screen.getByText('Comunicação ao colaborador').closest('button');
    expect(button).toBeDisabled();
  });

  it('calls onToggle with false when unchecking', () => {
    const onToggle = vi.fn();
    const withOne = { ...emptyDesligamento, checklist_comunicacao: true };
    render(<DesligamentoChecklist desligamento={withOne} onToggle={onToggle} />);
    fireEvent.click(screen.getByText('Comunicação ao colaborador'));
    expect(onToggle).toHaveBeenCalledWith('checklist_comunicacao', false);
  });

  it('has correct number of items (8)', () => {
    expect(CHECKLIST_ITEMS.length).toBe(8);
  });

  it('all items have key and label', () => {
    CHECKLIST_ITEMS.forEach((item) => {
      expect(item.key).toBeTruthy();
      expect(item.label).toBeTruthy();
    });
  });
});
