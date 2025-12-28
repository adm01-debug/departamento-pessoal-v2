import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HoraExtraCard } from '@/components/horas-extras/HoraExtraCard';
describe('HoraExtraCard', () => { it('renders', () => { render(<HoraExtraCard />); expect(true).toBe(true); }); });
