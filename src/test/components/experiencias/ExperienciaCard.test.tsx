import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ExperienciaCard } from '@/components/experiencias/ExperienciaCard';
describe('ExperienciaCard', () => { it('renders', () => { render(<ExperienciaCard />); expect(true).toBe(true); }); });
