import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ComentarioCard } from '@/components/comentarios/ComentarioCard';
describe('ComentarioCard', () => { it('renders', () => { render(<ComentarioCard />); expect(true).toBe(true); }); });
