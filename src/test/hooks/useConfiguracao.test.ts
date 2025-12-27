import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useConfiguracao } from '@/hooks/useConfiguracao';
describe('useConfiguracao', () => { it('retorna config', () => { const { result } = renderHook(() => useConfiguracao()); expect(result.current.config).toBeDefined(); }); });
