import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useFavicon } from '@/hooks/useFavicon';
describe('useFavicon', () => { it('altera favicon', () => { renderHook(() => useFavicon('/icon.png')); }); });
