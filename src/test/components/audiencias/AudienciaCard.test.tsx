import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AudienciaCard } from '@/components/audiencias/AudienciaCard';
describe('AudienciaCard', () => { it('renders', () => { render(<AudienciaCard />); expect(true).toBe(true); }); });
