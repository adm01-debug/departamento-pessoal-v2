import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TransferenciaCard } from '@/components/transferencias/TransferenciaCard';
describe('TransferenciaCard', () => { it('renders', () => { render(<TransferenciaCard />); expect(true).toBe(true); }); });
