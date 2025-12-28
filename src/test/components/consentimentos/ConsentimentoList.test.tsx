import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ConsentimentoList } from '@/components/consentimentos/ConsentimentoList';
describe('ConsentimentoList', () => { it('renders', () => { render(<ConsentimentoList />); expect(true).toBe(true); }); });
