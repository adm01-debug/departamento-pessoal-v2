import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { ColaboradorCard } from '@/components/colaborador/ColaboradorCard';
describe('ColaboradorCard', () => { it('renders', () => { render(<ColaboradorCard />); }); });
