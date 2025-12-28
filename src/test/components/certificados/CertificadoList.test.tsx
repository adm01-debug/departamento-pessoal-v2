import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CertificadoList } from '@/components/certificados/CertificadoList';
describe('CertificadoList', () => { it('renders', () => { render(<CertificadoList />); expect(true).toBe(true); }); });
