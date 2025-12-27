import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Bitrix24SyncStatus } from '@/components/integracoes/Bitrix24SyncStatus';
describe('Bitrix24SyncStatus', () => {
  it('exibe sincronizado', () => { render(<Bitrix24SyncStatus status="synced" lastSync="2025-01-01" />); expect(screen.getByText(/sincronizado/i)).toBeInTheDocument(); });
  it('exibe erro', () => { render(<Bitrix24SyncStatus status="error" />); expect(screen.getByText(/erro/i)).toBeInTheDocument(); });
});
