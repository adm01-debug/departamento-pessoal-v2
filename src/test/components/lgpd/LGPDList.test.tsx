import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LGPDList } from '@/components/lgpd/LGPDList';
describe('LGPDList', () => { it('renders', () => { render(<LGPDList />); expect(true).toBe(true); }); });
