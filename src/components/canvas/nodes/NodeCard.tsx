import { Handle, Position } from '@xyflow/react'
import type { LucideIcon } from 'lucide-react'
import { useStudioStore } from '../../../store/useStudioStore'

const handlePositions = {
  LR: { target: Position.Left, source: Position.Right },
  RL: { target: Position.Right, source: Position.Left },
  TB: { target: Position.Top, source: Position.Bottom },
  BT: { target: Position.Bottom, source: Position.Top },
}

type Props = {
  category: string
  label: string
  name: string
  icon: LucideIcon
  detail?: string
  badges?: string[]
}

export function NodeCard({ category, label, name, icon: Icon, detail, badges = [] }: Props) {
  const direction = useStudioStore((state) => state.layoutDirection)
  const handles = handlePositions[direction]

  return (
    <div className={`graph-card graph-card-${category}`}>
      <Handle type="target" position={handles.target} />
      <div className="graph-card-header">
        <span className="graph-card-icon"><Icon size={17} strokeWidth={1.8} /></span>
        <span className="graph-card-category">{label}</span>
      </div>
      <strong className="graph-card-name" title={name}>{name}</strong>
      {detail && <span className="graph-card-detail" title={detail}>{detail}</span>}
      {badges.length > 0 && (
        <div className="graph-card-badges">
          {badges.map((badge) => <span className="graph-card-badge" title={badge} key={badge}>{badge}</span>)}
        </div>
      )}
      <Handle type="source" position={handles.source} />
    </div>
  )
}
