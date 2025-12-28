import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ConsentimentoCard } from '@/components/consentimentos/ConsentimentoCard';
describe('ConsentimentoCard', () => { it('renders', () => { render(<ConsentimentoCard />); expect(true).toBe(true); }); });
