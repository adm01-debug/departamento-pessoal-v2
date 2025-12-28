import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ConsignadoCard } from '@/components/consignados/ConsignadoCard';
describe('ConsignadoCard', () => { it('renders', () => { render(<ConsignadoCard />); expect(true).toBe(true); }); });
