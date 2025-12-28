import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AdvertenciaList } from '@/components/advertencias/AdvertenciaList';
describe('AdvertenciaList', () => { it('renders', () => { render(<AdvertenciaList />); expect(true).toBe(true); }); });
