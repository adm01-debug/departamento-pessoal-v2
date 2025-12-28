import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EncargosList } from '@/components/encargos/EncargosList';
describe('EncargosList', () => { it('renders', () => { render(<EncargosList />); expect(true).toBe(true); }); });
