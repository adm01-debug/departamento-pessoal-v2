import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';

export interface WidgetConfig {
  id: string;
  title: string;
  visible: boolean;
  order: number;
  size: 'small' | 'medium' | 'large' | 'full';
}

const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: 'kpis', title: 'KPIs Principais', visible: true, order: 0, size: 'full' },
  { id: 'alerts', title: 'Alertas de Indicadores', visible: true, order: 1, size: 'small' },
  { id: 'turnover', title: 'Taxa de Turnover', visible: true, order: 2, size: 'small' },
  { id: 'absenteeism', title: 'Absenteísmo', visible: true, order: 3, size: 'small' },
  { id: 'payroll', title: 'Custo de Folha', visible: true, order: 4, size: 'small' },
  { id: 'turnover-evolution', title: 'Evolução do Turnover', visible: true, order: 5, size: 'medium' },
  { id: 'turnover-comparison', title: 'Comparativo Anual', visible: true, order: 6, size: 'medium' },
  { id: 'department-chart', title: 'Colaboradores por Departamento', visible: true, order: 7, size: 'medium' },
  { id: 'status-chart', title: 'Distribuição por Status', visible: true, order: 8, size: 'medium' },
  { id: 'admissions-chart', title: 'Evolução de Admissões', visible: true, order: 9, size: 'full' },
  { id: 'urgent-alerts', title: 'Alertas Urgentes', visible: true, order: 10, size: 'medium' },
  { id: 'calendar', title: 'Calendário do Mês', visible: true, order: 11, size: 'medium' },
];

const STORAGE_KEY = 'dashboard_widgets_config';


export interface UseDashboardConfigReturn {
  widgets: WidgetConfig[];
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  reorderWidgets: (activeId: string, overId: string) => void;
  toggleVisibility: (id: string) => void;
  updateSize: (id: string, size: WidgetConfig['size']) => void;
  resetToDefaults: () => void;
  getVisibleWidgets: () => WidgetConfig[];
}

export function useDashboardConfig(): UseDashboardConfigReturn {
  const [widgets, setWidgets] = useState<WidgetConfig[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with defaults to ensure new widgets are included
        const savedIds = new Set(parsed.map((w: WidgetConfig) => w.id));
        const newWidgets = DEFAULT_WIDGETS.filter(w => !savedIds.has(w.id));
        return [...parsed, ...newWidgets].sort((a, b) => a.order - b.order);
      }
    } catch (e) {
      logger.error('Error loading dashboard config:', e);
    }
    return DEFAULT_WIDGETS;
  });

  const [isEditing, setIsEditing] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
    } catch (e) {
      logger.error('Error saving dashboard config:', e);
    }
  }, [widgets]);

  const reorderWidgets = useCallback((activeId: string, overId: string) => {
    setWidgets(prev => {
      const oldIndex = prev.findIndex(w => w.id === activeId);
      const newIndex = prev.findIndex(w => w.id === overId);
      
      if (oldIndex === -1 || newIndex === -1) return prev;
      
      const newWidgets = [...prev];
      const [removed] = newWidgets.splice(oldIndex, 1);
      newWidgets.splice(newIndex, 0, removed);
      
      // Update order
      return newWidgets.map((w, i) => ({ ...w, order: i }));
    });
  }, []);

  const toggleVisibility = useCallback((id: string) => {
    setWidgets(prev => 
      prev.map(w => w.id === id ? { ...w, visible: !w.visible } : w)
    );
  }, []);

  const updateSize = useCallback((id: string, size: WidgetConfig['size']) => {
    setWidgets(prev => 
      prev.map(w => w.id === id ? { ...w, size } : w)
    );
  }, []);

  const resetToDefaults = useCallback(() => {
    setWidgets(DEFAULT_WIDGETS);
  }, []);

  const getVisibleWidgets = useCallback(() => {
    return widgets.filter(w => w.visible).sort((a, b) => a.order - b.order);
  }, [widgets]);

  return {
    widgets,
    isEditing,
    setIsEditing,
    reorderWidgets,
    toggleVisibility,
    updateSize,
    resetToDefaults,
    getVisibleWidgets,
  };
}


