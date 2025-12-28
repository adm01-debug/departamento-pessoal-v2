import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EtapaList } from '@/components/etapas/EtapaList';
describe('EtapaList', () => { it('renders', () => { render(<EtapaList />); expect(true).toBe(true); }); });
