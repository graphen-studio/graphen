import type { NodeProps } from '@xyflow/react'
import { Boxes } from 'lucide-react'
import { nodeText } from './nodeText'

export function GroupNode({ data }: NodeProps) {
  return (
    <div className="graph-group">
      <div className="graph-group-header">
        <div className="graph-group-title"><Boxes size={16} />{nodeText(data.name) ?? 'Group'}</div>
        {nodeText(data.description) && <span className="graph-group-description">{nodeText(data.description)}</span>}
      </div>
    </div>
  )
}
