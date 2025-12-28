import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ComplianceList } from '@/components/compliance/ComplianceList';
describe('ComplianceList', () => { it('renders', () => { render(<ComplianceList />); expect(true).toBe(true); }); });
