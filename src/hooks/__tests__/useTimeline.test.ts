import { renderHook, act } from '@testing-library/react';
import { useTimeline } from '../useTimeline';

const mockEvents = [
  { id: '1', date: '2024-01-15', title: 'Evento 1', type: 'info' },
  { id: '2', date: '2024-02-20', title: 'Evento 2', type: 'warning' },
  { id: '3', date: '2024-03-10', title: 'Evento 3', type: 'success' },
];

describe('useTimeline', () => {
  it('should initialize with provided events', () => {
    const { result } = renderHook(() => useTimeline(mockEvents));
    expect(result.current.events).toHaveLength(3);
  });

  it('should sort events by date', () => {
    const { result } = renderHook(() => useTimeline(mockEvents));
    const dates = result.current.sortedEvents.map(e => e.date);
    expect(dates).toEqual([...dates].sort());
  });

  it('should filter events by type', () => {
    const { result } = renderHook(() => useTimeline(mockEvents));
    
    act(() => {
      result.current.filterByType('warning');
    });
    
    expect(result.current.filteredEvents).toHaveLength(1);
    expect(result.current.filteredEvents[0].type).toBe('warning');
  });

  it('should filter events by date range', () => {
    const { result } = renderHook(() => useTimeline(mockEvents));
    
    act(() => {
      result.current.filterByDateRange('2024-01-01', '2024-02-28');
    });
    
    expect(result.current.filteredEvents).toHaveLength(2);
  });

  it('should reset filters', () => {
    const { result } = renderHook(() => useTimeline(mockEvents));
    
    act(() => {
      result.current.filterByType('warning');
    });
    expect(result.current.filteredEvents).toHaveLength(1);
    
    act(() => {
      result.current.resetFilters();
    });
    expect(result.current.filteredEvents).toHaveLength(3);
  });

  it('should handle empty events array', () => {
    const { result } = renderHook(() => useTimeline([]));
    expect(result.current.events).toHaveLength(0);
    expect(result.current.filteredEvents).toHaveLength(0);
  });
});
