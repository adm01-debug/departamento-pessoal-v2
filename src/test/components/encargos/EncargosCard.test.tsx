import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EncargosCard } from '@/components/encargos/EncargosCard';
describe('EncargosCard', () => { it('renders', () => { render(<EncargosCard />); expect(true).toBe(true); }); });
