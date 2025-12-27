import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MainContent } from '@/components/layout/MainContent';
describe('MainContent', () => { it('renderiza conteúdo', () => { render(<MainContent>Conteúdo principal</MainContent>); expect(screen.getByText('Conteúdo principal')).toBeInTheDocument(); }); });
