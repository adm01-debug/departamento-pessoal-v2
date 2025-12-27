import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ConfigSection } from '@/components/configuracoes/ConfigSection';
describe('ConfigSection', () => { it('renderiza seção', () => { render(<ConfigSection title="Seção"><div>Content</div></ConfigSection>); expect(screen.getByText('Seção')).toBeInTheDocument(); }); });
