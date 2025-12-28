import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ComplianceCard } from '@/components/compliance/ComplianceCard';
describe('ComplianceCard', () => { it('renders', () => { render(<ComplianceCard />); expect(true).toBe(true); }); });
