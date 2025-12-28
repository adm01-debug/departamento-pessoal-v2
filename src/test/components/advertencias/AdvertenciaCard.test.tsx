import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AdvertenciaCard } from '@/components/advertencias/AdvertenciaCard';
describe('AdvertenciaCard', () => { it('renders', () => { render(<AdvertenciaCard />); expect(true).toBe(true); }); });
