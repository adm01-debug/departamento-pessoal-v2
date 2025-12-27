import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useBackupExport } from '@/hooks/useBackupExport';
describe('useBackupExport', () => {
  it('retorna funções de export', () => { const { result } = renderHook(() => useBackupExport()); expect(result.current.exportData).toBeDefined(); });
});
