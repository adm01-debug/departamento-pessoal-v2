import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Folder, FileText, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface TreeNode {
  id: string;
  nome: string;
  tipo: 'pasta' | 'arquivo';
  children?: TreeNode[];
}

interface DocumentoTreeProps {
  data: TreeNode[];
  onSelect?: (node: TreeNode) => void;
}

function TreeItem({ node, level = 0, onSelect }: { node: TreeNode; level?: number; onSelect?: (node: TreeNode) => void }) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-muted',
          { 'pl-4': level > 0 }
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          if (hasChildren) setExpanded(!expanded);
          onSelect?.(node);
        }}
      >
        {hasChildren && (
          <ChevronRight className={cn('h-4 w-4 transition-transform', { 'rotate-90': expanded })} />
        )}
        {node.tipo === 'pasta' ? (
          <Folder className="h-4 w-4 text-muted-foreground" />
        ) : (
          <FileText className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="text-sm">{node.nome}</span>
      </div>
      {expanded && hasChildren && (
        <div>
          {node.children!.map((child) => (
            <TreeItem key={child.id} node={child} level={level + 1} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

export function DocumentoTree({ data, onSelect }: DocumentoTreeProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estrutura de Documentos</CardTitle>
      </CardHeader>
      <CardContent>
        {data.map((node) => (
          <TreeItem key={node.id} node={node} onSelect={onSelect} />
        ))}
      </CardContent>
    </Card>
  );
}
