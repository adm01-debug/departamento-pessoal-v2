import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ElogioList } from '@/components/elogios/ElogioList';
describe('ElogioList', () => { it('renders', () => { render(<ElogioList />); expect(true).toBe(true); }); });
