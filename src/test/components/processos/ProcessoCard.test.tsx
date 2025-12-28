import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProcessoCard } from '@/components/processos/ProcessoCard';
describe('ProcessoCard', () => { it('renders', () => { render(<ProcessoCard />); expect(true).toBe(true); }); });
