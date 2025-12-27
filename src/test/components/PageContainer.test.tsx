import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PageContainer } from '@/components/layout/PageContainer';
describe('PageContainer', () => { it('renderiza container', () => { render(<PageContainer title="Página"><div>Content</div></PageContainer>); expect(screen.getByText('Página')).toBeInTheDocument(); }); });
