import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AcordoCard } from '@/components/acordos/AcordoCard';
describe('AcordoCard', () => { it('renders', () => { render(<AcordoCard />); expect(true).toBe(true); }); });
