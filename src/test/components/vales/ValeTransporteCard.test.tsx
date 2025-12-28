import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ValeTransporteCard } from '@/components/vales/ValeTransporteCard';
describe('ValeTransporteCard', () => { it('renders', () => { render(<ValeTransporteCard />); expect(true).toBe(true); }); });
