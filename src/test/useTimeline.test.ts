import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimeline } from '@/hooks/useTimeline';

describe('useTimeline', () => {
  const mockEvents = [
    { id: '1', date: '2024-01-15', title: 'Evento 1' },
    { id: '2', date: '2024-01-20', title: 'Evento 2' },
    { id: '3', date: '2024-02-01', title: 'Evento 3' },
  ];

  it('deve retornar eventos da timeline', () => {
    const { result } = renderHook(() => useTimeline(mockEvents));
    expect(result.current.events).toBeDefined();
    expect(result.current.events.length).toBe(3);
  });

  it('deve ordenar eventos por data', () => {
    const { result } = renderHook(() => useTimeline(mockEvents));
    expect(result.current.sortedEvents[0].date).toBe('2024-01-15');
  });

  it('deve agrupar eventos por mês', () => {
    const { result } = renderHook(() => useTimeline(mockEvents));
    expect(result.current.groupedByMonth).toBeDefined();
  });

  it('deve filtrar eventos por período', () => {
    const { result } = renderHook(() => useTimeline(mockEvents));
    
    act(() => {
      result.current.setDateRange({ start: '2024-01-01', end: '2024-01-31' });
    });
    
    expect(result.current.filteredEvents.length).toBe(2);
  });

  it('deve ter navegação para próximo/anterior', () => {
    const { result } = renderHook(() => useTimeline(mockEvents));
    expect(result.current.goToNext).toBeDefined();
    expect(result.current.goToPrevious).toBeDefined();
  });
});
