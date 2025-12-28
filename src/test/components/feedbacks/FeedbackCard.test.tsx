import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FeedbackCard } from '@/components/feedbacks/FeedbackCard';
describe('FeedbackCard', () => { it('renders', () => { render(<FeedbackCard />); expect(true).toBe(true); }); });
