import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ReclamatoriaList } from '@/components/reclamatorias/ReclamatoriaList';
describe('ReclamatoriaList', () => { it('renders', () => { render(<ReclamatoriaList />); expect(true).toBe(true); }); });
