import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ComentarioList } from '@/components/comentarios/ComentarioList';
describe('ComentarioList', () => { it('renders', () => { render(<ComentarioList />); expect(true).toBe(true); }); });
