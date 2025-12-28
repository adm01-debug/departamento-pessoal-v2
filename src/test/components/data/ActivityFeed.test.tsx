import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { ActivityFeed } from '@/components/data/ActivityFeed';
describe('ActivityFeed', () => { it('renders', () => { render(<ActivityFeed />); }); });
