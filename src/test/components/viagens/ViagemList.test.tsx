import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ViagemList } from '@/components/viagens/ViagemList';
describe('ViagemList', () => { it('renders', () => { render(<ViagemList />); expect(true).toBe(true); }); });
