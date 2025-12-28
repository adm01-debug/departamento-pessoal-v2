import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EtapaCard } from '@/components/etapas/EtapaCard';
describe('EtapaCard', () => { it('renders', () => { render(<EtapaCard />); expect(true).toBe(true); }); });
