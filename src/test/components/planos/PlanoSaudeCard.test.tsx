import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PlanoSaudeCard } from '@/components/planos/PlanoSaudeCard';
describe('PlanoSaudeCard', () => { it('renders', () => { render(<PlanoSaudeCard />); expect(true).toBe(true); }); });
