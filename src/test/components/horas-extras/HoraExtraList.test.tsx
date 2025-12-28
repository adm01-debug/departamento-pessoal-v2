import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HoraExtraList } from '@/components/horas-extras/HoraExtraList';
describe('HoraExtraList', () => { it('renders', () => { render(<HoraExtraList />); expect(true).toBe(true); }); });
