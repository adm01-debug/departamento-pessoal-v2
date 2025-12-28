import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PeritosList } from '@/components/peritos/PeritosList';
describe('PeritosList', () => { it('renders', () => { render(<PeritosList />); expect(true).toBe(true); }); });
