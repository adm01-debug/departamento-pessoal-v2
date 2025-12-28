/**
 * @fileoverview Kanban Board Avançado com Drag and Drop
 * @version V8.0 - Implementação REAL
 */
import React, { useState, useCallback, useMemo } from 'react';
import { Plus, MoreHorizontal, Edit, Trash, GripVertical, User, Calendar, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// TIPOS
// ============================================

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  order: number;
  assignee?: { id: string; name: string; avatar?: string };
  dueDate?: string;
  tags?: { id: string; label: string; color: string }[];
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  metadata?: Record<string, any>;
}

export interface KanbanColumn {
  id: string;
  title: string;
  color?: string;
  limit?: number;
  order: number;
}

export interface KanbanProps {
  columns: KanbanColumn[];
  cards: KanbanCard[];
  onCardMove?: (cardId: string, fromColumn: string, toColumn: string, newOrder: number) => void;
  onCardClick?: (card: KanbanCard) => void;
  onCardEdit?: (card: KanbanCard) => void;
  onCardDelete?: (cardId: string) => void;
  onCardCreate?: (columnId: string) => void;
  onColumnEdit?: (column: KanbanColumn) => void;
  onColumnDelete?: (columnId: string) => void;
  onColumnCreate?: () => void;
  renderCard?: (card: KanbanCard) => React.ReactNode;
  className?: string;
  cardClassName?: string;
  columnClassName?: string;
  allowColumnReorder?: boolean;
  allowCardCreate?: boolean;
  showCardCount?: boolean;
  showWipLimit?: boolean;
}

// ============================================
// COMPONENTES AUXILIARES
// ============================================

const PriorityBadge: React.FC<{ priority: KanbanCard['priority'] }> = ({ priority }) => {
  const colors = {
    low: 'bg-gray-100 text-gray-600',
    medium: 'bg-blue-100 text-blue-600',
    high: 'bg-orange-100 text-orange-600',
    urgent: 'bg-red-100 text-red-600',
  };

  if (!priority) return null;

  return (
    <span className={cn('px-2 py-0.5 rounded text-xs font-medium', colors[priority])}>
      {priority === 'low' && 'Baixa'}
      {priority === 'medium' && 'Média'}
      {priority === 'high' && 'Alta'}
      {priority === 'urgent' && 'Urgente'}
    </span>
  );
};

const CardComponent: React.FC<{
  card: KanbanCard;
  onDragStart: (e: React.DragEvent, card: KanbanCard) => void;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}> = ({ card, onDragStart, onClick, onEdit, onDelete, className }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, card)}
      onClick={onClick}
      className={cn(
        'bg-white border rounded-lg p-3 shadow-sm cursor-grab active:cursor-grabbing',
        'hover:shadow-md transition-shadow group',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" />
          <h4 className="font-medium text-sm">{card.title}</h4>
        </div>
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white border rounded-md shadow-lg z-10 min-w-32">
              <button
                onClick={(e) => { e.stopPropagation(); onEdit?.(); setShowMenu(false); }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <Edit className="h-4 w-4" /> Editar
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete?.(); setShowMenu(false); }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2"
              >
                <Trash className="h-4 w-4" /> Excluir
              </button>
            </div>
          )}
        </div>
      </div>

      {card.description && (
        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{card.description}</p>
      )}

      {card.tags && card.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {card.tags.map(tag => (
            <span
              key={tag.id}
              className="px-2 py-0.5 rounded text-xs"
              style={{ backgroundColor: tag.color + '20', color: tag.color }}
            >
              {tag.label}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-2 border-t">
        <div className="flex items-center gap-2">
          {card.assignee && (
            <div className="flex items-center gap-1">
              {card.assignee.avatar ? (
                <img src={card.assignee.avatar} alt="" className="h-6 w-6 rounded-full" />
              ) : (
                <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-3 w-3 text-gray-500" />
                </div>
              )}
              <span className="text-xs text-gray-500">{card.assignee.name}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <PriorityBadge priority={card.priority} />
          {card.dueDate && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              {new Date(card.dueDate).toLocaleDateString('pt-BR')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export function Kanban({
  columns,
  cards,
  onCardMove,
  onCardClick,
  onCardEdit,
  onCardDelete,
  onCardCreate,
  onColumnEdit,
  onColumnDelete,
  onColumnCreate,
  renderCard,
  className,
  cardClassName,
  columnClassName,
  allowColumnReorder = false,
  allowCardCreate = true,
  showCardCount = true,
  showWipLimit = true,
}: KanbanProps) {
  const [draggedCard, setDraggedCard] = useState<KanbanCard | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Agrupar cards por coluna
  const cardsByColumn = useMemo(() => {
    const grouped: Record<string, KanbanCard[]> = {};
    columns.forEach(col => { grouped[col.id] = []; });
    
    cards
      .sort((a, b) => a.order - b.order)
      .forEach(card => {
        if (grouped[card.columnId]) {
          grouped[card.columnId].push(card);
        }
      });
    
    return grouped;
  }, [columns, cards]);

  // Handlers de Drag and Drop
  const handleDragStart = useCallback((e: React.DragEvent, card: KanbanCard) => {
    setDraggedCard(card);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', card.id);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, columnId: string, index?: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
    if (index !== undefined) setDragOverIndex(index);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverColumn(null);
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, columnId: string, index?: number) => {
    e.preventDefault();
    
    if (draggedCard && draggedCard.columnId !== columnId) {
      const newOrder = index ?? cardsByColumn[columnId].length;
      onCardMove?.(draggedCard.id, draggedCard.columnId, columnId, newOrder);
    } else if (draggedCard && index !== undefined) {
      onCardMove?.(draggedCard.id, draggedCard.columnId, columnId, index);
    }
    
    setDraggedCard(null);
    setDragOverColumn(null);
    setDragOverIndex(null);
  }, [draggedCard, cardsByColumn, onCardMove]);

  const handleDragEnd = useCallback(() => {
    setDraggedCard(null);
    setDragOverColumn(null);
    setDragOverIndex(null);
  }, []);

  return (
    <div className={cn('flex gap-4 overflow-x-auto p-4', className)}>
      {columns
        .sort((a, b) => a.order - b.order)
        .map(column => {
          const columnCards = cardsByColumn[column.id] || [];
          const isOverLimit = column.limit && columnCards.length > column.limit;
          const isDragOver = dragOverColumn === column.id;

          return (
            <div
              key={column.id}
              className={cn(
                'flex-shrink-0 w-72 bg-gray-100 rounded-lg',
                isDragOver && 'ring-2 ring-primary ring-offset-2',
                columnClassName
              )}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Header da Coluna */}
              <div
                className="p-3 border-b bg-gray-50 rounded-t-lg"
                style={{ borderTopColor: column.color, borderTopWidth: column.color ? 3 : 0 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{column.title}</h3>
                    {showCardCount && (
                      <span className={cn(
                        'px-2 py-0.5 rounded-full text-xs font-medium',
                        isOverLimit ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-600'
                      )}>
                        {columnCards.length}
                        {showWipLimit && column.limit && `/${column.limit}`}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {allowCardCreate && (
                      <button
                        onClick={() => onCardCreate?.(column.id)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onColumnEdit?.(column)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Cards */}
              <div className="p-2 space-y-2 min-h-32 max-h-[calc(100vh-200px)] overflow-y-auto">
                {columnCards.map((card, index) => (
                  <div
                    key={card.id}
                    onDragOver={(e) => handleDragOver(e, column.id, index)}
                  >
                    {dragOverIndex === index && dragOverColumn === column.id && (
                      <div className="h-1 bg-primary rounded mb-2" />
                    )}
                    {renderCard ? (
                      renderCard(card)
                    ) : (
                      <CardComponent
                        card={card}
                        onDragStart={handleDragStart}
                        onClick={() => onCardClick?.(card)}
                        onEdit={() => onCardEdit?.(card)}
                        onDelete={() => onCardDelete?.(card.id)}
                        className={cardClassName}
                      />
                    )}
                  </div>
                ))}
                
                {columnCards.length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    Arraste cards aqui
                  </div>
                )}
              </div>

              {/* Footer */}
              {allowCardCreate && (
                <div className="p-2 border-t">
                  <button
                    onClick={() => onCardCreate?.(column.id)}
                    className="w-full py-2 text-sm text-gray-500 hover:bg-gray-200 rounded flex items-center justify-center gap-1"
                  >
                    <Plus className="h-4 w-4" /> Adicionar card
                  </button>
                </div>
              )}
            </div>
          );
        })}

      {/* Botão Nova Coluna */}
      {onColumnCreate && (
        <div className="flex-shrink-0 w-72">
          <button
            onClick={onColumnCreate}
            className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-500"
          >
            <Plus className="h-5 w-5" /> Nova Coluna
          </button>
        </div>
      )}
    </div>
  );
}

export default Kanban;
