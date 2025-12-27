import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useDisclosure } from '@/hooks/useDisclosure';
describe('useDisclosure', () => { it('gerencia estado', () => { const { result } = renderHook(() => useDisclosure()); expect(result.current.isOpen).toBe(false); act(() => { result.current.onOpen(); }); expect(result.current.isOpen).toBe(true); }); });
