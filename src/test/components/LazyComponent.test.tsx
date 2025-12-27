import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LazyComponent } from '@/components/performance/LazyComponent';
describe('LazyComponent', () => { it('renderiza loading', () => { render(<LazyComponent fallback={<div>Carregando...</div>}><div>Content</div></LazyComponent>); expect(screen.getByText('Content')).toBeInTheDocument(); }); });
