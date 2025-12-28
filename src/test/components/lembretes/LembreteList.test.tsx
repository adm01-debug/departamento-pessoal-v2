import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LembreteList } from '@/components/lembretes/LembreteList';
describe('LembreteList', () => { it('renders', () => { render(<LembreteList />); expect(true).toBe(true); }); });
