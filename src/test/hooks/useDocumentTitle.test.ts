import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
describe('useDocumentTitle', () => { it('altera título', () => { renderHook(() => useDocumentTitle('Test Title')); expect(document.title).toBe('Test Title'); }); });
