import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { IntegracaoCard } from '@/components/integracoes/IntegracaoCard';
describe('IntegracaoCard', () => { it('renders', () => { render(<IntegracaoCard />); expect(true).toBe(true); }); });
