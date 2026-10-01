import { NodeResizer, type NodeProps, type ResizeParams } from '@xyflow/react'
import { Boxes } from 'lucide-react'
import { nodeText } from './nodeText'

export function GroupNode({ data, selected }: NodeProps) {
  const handleResizeEnd = (_: unknown, params: ResizeParams) => {
    if (typeof data.onResizeEnd === 'function') {
      (data.onResizeEnd as (params: ResizeParams) => void)(params)
    }
  }

  return (
    <div className="graph-group">
      <NodeResizer
        isVisible={selected}
        minWidth={280}
        minHeight={150}
        lineClassName="group-resizer-line"
        handleClassName="group-resizer-handle"
        onResizeEnd={handleResizeEnd}
      />
      <div className="graph-group-header">
        <div className="graph-group-title"><Boxes size={16} />{nodeText(data.name) ?? 'Group'}</div>
        {nodeText(data.description) && <span className="graph-group-description">{nodeText(data.description)}</span>}
      </div>
    </div>
  )
}
