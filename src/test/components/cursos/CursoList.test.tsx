import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CursoList } from '@/components/cursos/CursoList';
describe('CursoList', () => { it('renders', () => { render(<CursoList />); expect(true).toBe(true); }); });
