import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PortalHeader } from '@/components/portal/PortalHeader';
describe('PortalHeader', () => { it('renderiza header', () => { render(<PortalHeader titulo="Portal" />); expect(screen.getByText('Portal')).toBeInTheDocument(); }); });
