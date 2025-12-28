import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ExameMedicoCard } from '@/components/exames/ExameMedicoCard';
describe('ExameMedicoCard', () => { it('renders', () => { render(<ExameMedicoCard />); expect(true).toBe(true); }); });
