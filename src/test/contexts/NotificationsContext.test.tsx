import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NotificationsProvider, useNotificationsContext } from '@/contexts/NotificationsContext';
describe('NotificationsContext', () => { it('fornece contexto', () => { const wrapper = ({ children }: any) => <NotificationsProvider>{children}</NotificationsProvider>; const { result } = renderHook(() => useNotificationsContext(), { wrapper }); expect(result.current.notifications).toBeDefined(); }); });
