import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { IntegracaoList } from '@/components/integracoes/IntegracaoList';
describe('IntegracaoList', () => { it('renders', () => { render(<IntegracaoList />); expect(true).toBe(true); }); });
