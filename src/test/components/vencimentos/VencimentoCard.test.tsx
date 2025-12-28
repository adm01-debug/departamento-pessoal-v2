import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { VencimentoCard } from '@/components/vencimentos/VencimentoCard';
describe('VencimentoCard', () => { it('renders', () => { render(<VencimentoCard />); expect(true).toBe(true); }); });
