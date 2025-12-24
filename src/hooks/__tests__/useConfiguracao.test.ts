import { renderHook, act } from '@testing-library/react';
import { useConfiguracao } from '../useConfiguracao';

describe('useConfiguracao', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with default config', () => {
    const { result } = renderHook(() => useConfiguracao());
    expect(result.current.config).toBeDefined();
  });

  it('should update config value', () => {
    const { result } = renderHook(() => useConfiguracao());
    
    act(() => {
      result.current.updateConfig('theme', 'dark');
    });
    
    expect(result.current.config.theme).toBe('dark');
  });

  it('should persist config to localStorage', () => {
    const { result } = renderHook(() => useConfiguracao());
    
    act(() => {
      result.current.updateConfig('language', 'en');
    });
    
    const stored = localStorage.getItem('app-config');
    expect(stored).toContain('en');
  });

  it('should reset to defaults', () => {
    const { result } = renderHook(() => useConfiguracao());
    
    act(() => {
      result.current.updateConfig('theme', 'dark');
      result.current.resetConfig();
    });
    
    expect(result.current.config).toEqual(result.current.defaultConfig);
  });

  it('should load config from localStorage', () => {
    localStorage.setItem('app-config', JSON.stringify({ theme: 'dark' }));
    
    const { result } = renderHook(() => useConfiguracao());
    expect(result.current.config.theme).toBe('dark');
  });

  it('should handle invalid localStorage data', () => {
    localStorage.setItem('app-config', 'invalid json');
    
    const { result } = renderHook(() => useConfiguracao());
    expect(result.current.config).toBeDefined();
  });
});
