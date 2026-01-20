// V19-033: Testes para Stores
import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../authStore';
import { useToastStore } from '../toastStore';
import { useFeatureFlags } from '../featureFlagStore';

describe('Auth Store', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it('deve iniciar deslogado', () => {
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('deve fazer login', () => {
    useAuthStore.getState().login({ id: '1', email: 'test@test.com', nome: 'Test', role: 'admin' }, 'token');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('deve fazer logout', () => {
    useAuthStore.getState().login({ id: '1', email: 'test@test.com', nome: 'Test', role: 'admin' }, 'token');
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});

describe('Toast Store', () => {
  beforeEach(() => {
    useToastStore.getState().clearToasts();
  });

  it('deve adicionar toast', () => {
    useToastStore.getState().addToast({ type: 'success', title: 'Test' });
    expect(useToastStore.getState().toasts.length).toBe(1);
  });

  it('deve limpar toasts', () => {
    useToastStore.getState().addToast({ type: 'error', title: 'Error' });
    useToastStore.getState().clearToasts();
    expect(useToastStore.getState().toasts.length).toBe(0);
  });
});

describe('Feature Flags Store', () => {
  it('deve verificar flag existente', () => {
    expect(useFeatureFlags.getState().isEnabled('novo-dashboard')).toBe(true);
  });

  it('deve toggle flag', () => {
    const initial = useFeatureFlags.getState().isEnabled('modo-escuro');
    useFeatureFlags.getState().toggleFlag('modo-escuro');
    expect(useFeatureFlags.getState().isEnabled('modo-escuro')).toBe(!initial);
  });
});
