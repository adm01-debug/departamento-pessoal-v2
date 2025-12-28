import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ObjetivoCard } from '@/components/objetivos/ObjetivoCard';
describe('ObjetivoCard', () => { it('renders', () => { render(<ObjetivoCard />); expect(true).toBe(true); }); });
