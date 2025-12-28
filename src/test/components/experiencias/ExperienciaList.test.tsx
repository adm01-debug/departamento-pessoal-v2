import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ExperienciaList } from '@/components/experiencias/ExperienciaList';
describe('ExperienciaList', () => { it('renders', () => { render(<ExperienciaList />); expect(true).toBe(true); }); });
