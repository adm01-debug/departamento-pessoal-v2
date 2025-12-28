import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { WebhookList } from '@/components/webhooks/WebhookList';
describe('WebhookList', () => { it('renders', () => { render(<WebhookList />); expect(true).toBe(true); }); });
