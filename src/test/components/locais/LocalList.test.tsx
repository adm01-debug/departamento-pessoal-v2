import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LocalList } from '@/components/locais/LocalList';
describe('LocalList', () => { it('renders', () => { render(<LocalList />); expect(true).toBe(true); }); });
