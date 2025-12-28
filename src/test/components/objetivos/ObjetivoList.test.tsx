import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ObjetivoList } from '@/components/objetivos/ObjetivoList';
describe('ObjetivoList', () => { it('renders', () => { render(<ObjetivoList />); expect(true).toBe(true); }); });
