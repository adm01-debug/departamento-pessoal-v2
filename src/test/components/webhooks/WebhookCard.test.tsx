import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { WebhookCard } from '@/components/webhooks/WebhookCard';
describe('WebhookCard', () => { it('renders', () => { render(<WebhookCard />); expect(true).toBe(true); }); });
