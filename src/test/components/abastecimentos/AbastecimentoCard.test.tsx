import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AbastecimentoCard } from '@/components/abastecimentos/AbastecimentoCard';
describe('AbastecimentoCard', () => { it('renders', () => { render(<AbastecimentoCard />); expect(true).toBe(true); }); });
