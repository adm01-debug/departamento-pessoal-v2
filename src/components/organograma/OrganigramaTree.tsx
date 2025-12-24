import { memo } from 'react';
interface TreeNode { id: string; nome: string; cargo: string; filhos?: TreeNode[]; }
interface OrganigramaTreeProps { data: TreeNode; renderNode: (node: TreeNode) => React.ReactNode; }
export const OrganigramaTree = memo(function OrganigramaTree({ data, renderNode }: OrganigramaTreeProps) {
  const renderLevel = (node: TreeNode) => (
    <div key={node.id} className="flex flex-col items-center">
      {renderNode(node)}
      {node.filhos && node.filhos.length > 0 && (
        <div className="flex gap-8 mt-4 pt-4 border-t">
          {node.filhos.map(child => renderLevel(child))}
        </div>
      )}
    </div>
  );
  return <div className="overflow-x-auto p-4">{renderLevel(data)}</div>;
});
