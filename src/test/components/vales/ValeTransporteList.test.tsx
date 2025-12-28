import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ValeTransporteList } from '@/components/vales/ValeTransporteList';
describe('ValeTransporteList', () => { it('renders', () => { render(<ValeTransporteList />); expect(true).toBe(true); }); });
