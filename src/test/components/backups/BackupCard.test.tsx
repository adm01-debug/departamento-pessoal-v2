import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BackupCard } from '@/components/backups/BackupCard';
describe('BackupCard', () => { it('renders', () => { render(<BackupCard />); expect(true).toBe(true); }); });
