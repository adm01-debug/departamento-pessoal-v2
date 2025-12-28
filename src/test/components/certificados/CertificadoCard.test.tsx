import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CertificadoCard } from '@/components/certificados/CertificadoCard';
describe('CertificadoCard', () => { it('renders', () => { render(<CertificadoCard />); expect(true).toBe(true); }); });
