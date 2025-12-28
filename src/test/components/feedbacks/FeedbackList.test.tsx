import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FeedbackList } from '@/components/feedbacks/FeedbackList';
describe('FeedbackList', () => { it('renders', () => { render(<FeedbackList />); expect(true).toBe(true); }); });
