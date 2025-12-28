import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CompetenciaCard } from '@/components/competencias/CompetenciaCard';
describe('CompetenciaCard', () => { it('renders', () => { render(<CompetenciaCard />); expect(true).toBe(true); }); });
