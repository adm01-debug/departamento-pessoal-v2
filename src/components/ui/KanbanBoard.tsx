// V14-056: KanbanBoard.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  labels?: Array<{ text: string; color: string }>;
  assignee?: { name: string; avatar?: string };
  dueDate?: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
  color?: string;
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  onCardClick?: (card: KanbanCard, columnId: string) => void;
  onCardMove?: (cardId: string, fromColumnId: string, toColumnId: string) => void;
  onAddCard?: (columnId: string) => void;
  onAddColumn?: () => void;
  className?: string;
}

export function KanbanBoard({ columns, onCardClick, onCardMove, onAddCard, onAddColumn, className }: KanbanBoardProps) {
  const [draggedCard, setDraggedCard] = useState<{ card: KanbanCard; columnId: string } | null>(null);

  const handleDragStart = (card: KanbanCard, columnId: string) => {
    setDraggedCard({ card, columnId });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetColumnId: string) => {
    if (draggedCard && draggedCard.columnId !== targetColumnId) {
      onCardMove?.(draggedCard.card.id, draggedCard.columnId, targetColumnId);
    }
    setDraggedCard(null);
  };

  return (
    <div className={cn("flex gap-4 overflow-x-auto pb-4", className)}>
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex-shrink-0 w-72 bg-muted/50 rounded-lg p-3"
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(column.id)}
        >
          {/* Column Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {column.color && <div className={cn("w-2 h-2 rounded-full", column.color)} />}
              <h3 className="font-medium">{column.title}</h3>
              <Badge variant="secondary" className="text-xs">{column.cards.length}</Badge>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onAddCard?.(column.id)}>Adicionar cartão</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Cards */}
          <div className="space-y-2">
            {column.cards.map((card) => (
              <Card
                key={card.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                draggable
                onDragStart={() => handleDragStart(card, column.id)}
                onClick={() => onCardClick?.(card, column.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5 cursor-grab" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{card.title}</p>
                      {card.description && <p className="text-xs text-muted-foreground mt-1 truncate">{card.description}</p>}
                      {card.labels && card.labels.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {card.labels.map((label, i) => (
                            <span key={i} className={cn("text-xs px-1.5 py-0.5 rounded text-white", label.color)}>{label.text}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        {card.dueDate && <span className="text-xs text-muted-foreground">{card.dueDate}</span>}
                        {card.assignee && (
                          <div className="flex items-center gap-1">
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground">
                              {card.assignee.name[0]}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add Card Button */}
          <Button variant="ghost" className="w-full mt-2 justify-start text-muted-foreground" onClick={() => onAddCard?.(column.id)}>
            <Plus className="h-4 w-4 mr-2" />Adicionar cartão
          </Button>
        </div>
      ))}

      {/* Add Column Button */}
      {onAddColumn && (
        <div className="flex-shrink-0 w-72">
          <Button variant="outline" className="w-full h-12" onClick={onAddColumn}>
            <Plus className="h-4 w-4 mr-2" />Nova coluna
          </Button>
        </div>
      )}
    </div>
  );
}

