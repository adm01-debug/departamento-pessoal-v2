import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BackupList } from '@/components/backups/BackupList';
describe('BackupList', () => { it('renders', () => { render(<BackupList />); expect(true).toBe(true); }); });
