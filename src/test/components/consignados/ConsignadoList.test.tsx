import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ConsignadoList } from '@/components/consignados/ConsignadoList';
describe('ConsignadoList', () => { it('renders', () => { render(<ConsignadoList />); expect(true).toBe(true); }); });
