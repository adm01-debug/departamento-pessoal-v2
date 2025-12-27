import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AssinaturaPreview } from '@/components/assinaturas/AssinaturaPreview';
describe('AssinaturaPreview', () => {
  it('renderiza preview', () => {
    render(<AssinaturaPreview imageUrl="data:image/png;base64,test" />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
  it('exibe placeholder', () => {
    render(<AssinaturaPreview />);
    expect(screen.getByText(/sem assinatura/i)).toBeInTheDocument();
  });
});
