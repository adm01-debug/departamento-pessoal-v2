import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { ColaboradorList } from '@/components/colaborador/ColaboradorList';
describe('ColaboradorList', () => { it('renders', () => { render(<ColaboradorList />); }); });
