import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ReferenciaCard } from '@/components/referencias/ReferenciaCard';
describe('ReferenciaCard', () => { it('renders', () => { render(<ReferenciaCard />); expect(true).toBe(true); }); });
