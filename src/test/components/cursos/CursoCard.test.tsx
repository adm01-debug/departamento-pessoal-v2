import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CursoCard } from '@/components/cursos/CursoCard';
describe('CursoCard', () => { it('renders', () => { render(<CursoCard />); expect(true).toBe(true); }); });
