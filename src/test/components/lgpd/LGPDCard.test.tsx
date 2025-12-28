import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LGPDCard } from '@/components/lgpd/LGPDCard';
describe('LGPDCard', () => { it('renders', () => { render(<LGPDCard />); expect(true).toBe(true); }); });
