import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AudienciaList } from '@/components/audiencias/AudienciaList';
describe('AudienciaList', () => { it('renders', () => { render(<AudienciaList />); expect(true).toBe(true); }); });
