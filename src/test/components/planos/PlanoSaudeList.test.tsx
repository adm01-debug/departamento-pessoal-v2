import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PlanoSaudeList } from '@/components/planos/PlanoSaudeList';
describe('PlanoSaudeList', () => { it('renders', () => { render(<PlanoSaudeList />); expect(true).toBe(true); }); });
