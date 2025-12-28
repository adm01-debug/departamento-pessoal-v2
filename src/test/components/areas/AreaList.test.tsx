import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AreaList } from '@/components/areas/AreaList';
describe('AreaList', () => { it('renders', () => { render(<AreaList />); expect(true).toBe(true); }); });
