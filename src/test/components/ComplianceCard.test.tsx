import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ComplianceCard } from '@/components/compliance/ComplianceCard';
describe('ComplianceCard', () => { it('renderiza card', () => { render(<ComplianceCard title="eSocial" status="ok" />); expect(screen.getByText('eSocial')).toBeInTheDocument(); }); it('exibe status', () => { render(<ComplianceCard title="LGPD" status="warning" />); expect(screen.getByText('LGPD')).toBeInTheDocument(); }); });
