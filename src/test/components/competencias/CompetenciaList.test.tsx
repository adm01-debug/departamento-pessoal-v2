import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CompetenciaList } from '@/components/competencias/CompetenciaList';
describe('CompetenciaList', () => { it('renders', () => { render(<CompetenciaList />); expect(true).toBe(true); }); });
