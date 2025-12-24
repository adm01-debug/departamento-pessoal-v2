import { renderHook, act } from '@testing-library/react';
import { useCalendario } from '../useCalendario';

describe('useCalendario', () => {
  it('should initialize with current month', () => {
    const { result } = renderHook(() => useCalendario());
    const today = new Date();
    expect(result.current.currentMonth).toBe(today.getMonth());
    expect(result.current.currentYear).toBe(today.getFullYear());
  });

  it('should navigate to next month', () => {
    const { result } = renderHook(() => useCalendario());
    const initialMonth = result.current.currentMonth;
    
    act(() => {
      result.current.nextMonth();
    });
    
    if (initialMonth === 11) {
      expect(result.current.currentMonth).toBe(0);
      expect(result.current.currentYear).toBe(new Date().getFullYear() + 1);
    } else {
      expect(result.current.currentMonth).toBe(initialMonth + 1);
    }
  });

  it('should navigate to previous month', () => {
    const { result } = renderHook(() => useCalendario());
    const initialMonth = result.current.currentMonth;
    
    act(() => {
      result.current.previousMonth();
    });
    
    if (initialMonth === 0) {
      expect(result.current.currentMonth).toBe(11);
    } else {
      expect(result.current.currentMonth).toBe(initialMonth - 1);
    }
  });

  it('should generate days for current month', () => {
    const { result } = renderHook(() => useCalendario());
    expect(result.current.days.length).toBeGreaterThan(0);
    expect(result.current.days.length).toBeLessThanOrEqual(42);
  });

  it('should go to specific date', () => {
    const { result } = renderHook(() => useCalendario());
    
    act(() => {
      result.current.goToDate(new Date(2024, 5, 15));
    });
    
    expect(result.current.currentMonth).toBe(5);
    expect(result.current.currentYear).toBe(2024);
  });

  it('should return today correctly', () => {
    const { result } = renderHook(() => useCalendario());
    const today = new Date();
    
    expect(result.current.isToday(today)).toBe(true);
    expect(result.current.isToday(new Date(2020, 0, 1))).toBe(false);
  });
});
