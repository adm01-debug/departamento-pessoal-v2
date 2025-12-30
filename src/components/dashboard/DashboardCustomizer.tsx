/**
 * @fileoverview Customizador de widgets do dashboard com drag-and-drop
 * @module components/dashboard/DashboardCustomizer
 */
import { useState, memo } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  GripVertical,
  Settings2,
  Eye,
  EyeOff,
  RotateCcw,
  Move,
} from 'lucide-react';
import { useDashboardConfig, WidgetConfig } from '@/hooks/useDashboardConfig';
import { cn } from '@/lib/utils';

interface SortableWidgetProps {
  widget: WidgetConfig;
  isEditing: boolean;
  children: React.ReactNode;
}

function SortableWidget({ widget, isEditing, children }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const sizeClasses = {
    small: 'col-span-1',
    medium: 'col-span-1 md:col-span-1',
    large: 'col-span-1 md:col-span-2',
    full: 'col-span-1 md:col-span-2 lg:col-span-4',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        sizeClasses[widget.size],
        isEditing && 'ring-2 ring-primary/50 ring-dashed rounded-xl'
      )}
    >
      <div className="relative h-full">
        {isEditing && (
          <div
            {...attributes}
            {...listeners}
            className="absolute -top-2 -left-2 z-10 p-1.5 rounded-full bg-primary text-primary-foreground cursor-grab active:cursor-grabbing shadow-lg"
          >
            <GripVertical className="w-4 h-4" />
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

interface DashboardCustomizerProps {
  children: (props: {
    renderWidget: (id: string, content: React.ReactNode) => React.ReactNode;
    isEditing: boolean;
  }) => React.ReactNode;
}

export function DashboardCustomizer({ children }: DashboardCustomizerProps) {
  const {
    widgets,
    isEditing,
    setIsEditing,
    reorderWidgets,
    toggleVisibility,
    updateSize,
    resetToDefaults,
    getVisibleWidgets,
  } = useDashboardConfig();

  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      reorderWidgets(String(active.id), String(over.id));
    }
    
    setActiveId(null);
  };

  const visibleWidgets = getVisibleWidgets();

  const renderWidget = (id: string, content: React.ReactNode) => {
    const widget = widgets.find(w => w.id === id);
    if (!widget || !widget.visible) return null;

    return (
      <SortableWidget key={id} widget={widget} isEditing={isEditing}>
        {content}
      </SortableWidget>
    );
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-end gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings2 className="w-4 h-4 mr-2" />
              Personalizar Dashboard
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px]">
            <SheetHeader>
              <SheetTitle>Personalizar Dashboard</SheetTitle>
              <SheetDescription>
                Escolha quais widgets exibir e configure seus tamanhos.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Move className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Modo de edição</span>
                </div>
                <Switch
                  checked={isEditing}
                  onCheckedChange={setIsEditing}
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={resetToDefaults}
                className="w-full"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Restaurar Padrão
              </Button>

              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="space-y-3 pr-4">
                  {widgets.map(widget => (
                    <Card key={widget.id} className="p-3">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => toggleVisibility(widget.id)}
                            >
                              {widget.visible ? (
                                <Eye className="w-4 h-4 text-success" />
                              ) : (
                                <EyeOff className="w-4 h-4 text-muted-foreground" />
                              )}
                            </Button>
                            <span className={cn(
                              "text-sm font-medium",
                              !widget.visible && "text-muted-foreground line-through"
                            )}>
                              {widget.title}
                            </span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            #{widget.order + 1}
                          </Badge>
                        </div>
                        <Select
                          value={widget.size}
                          onValueChange={(v) => updateSize(widget.id, v as WidgetConfig['size'])}
                          disabled={!widget.visible}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Tamanho" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Pequeno (1 coluna)</SelectItem>
                            <SelectItem value="medium">Médio (1 coluna)</SelectItem>
                            <SelectItem value="large">Grande (2 colunas)</SelectItem>
                            <SelectItem value="full">Largura total</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Dashboard Grid with DnD */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={visibleWidgets.map(w => w.id)}
          strategy={rectSortingStrategy}
        >
          {children({ renderWidget, isEditing })}
        </SortableContext>

        <DragOverlay>
          {activeId ? (
            <div className="bg-card border border-primary rounded-xl p-4 shadow-xl opacity-80">
              <p className="text-sm font-medium">
                {widgets.find(w => w.id === activeId)?.title}
              </p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}






