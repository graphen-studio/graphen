import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react'

export function ParticleEdge({
  id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, label, style,
}: EdgeProps) {
  const [path, labelX, labelY] = getBezierPath({
    sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition,
  })

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        style={style}
        label={label}
        labelX={labelX}
        labelY={labelY}
        labelStyle={{ fill: 'var(--accent)', fontSize: 11, fontWeight: 600 }}
        labelBgStyle={{ fill: 'var(--panel)', stroke: 'var(--border)', strokeWidth: 1 }}
        labelBgPadding={[12, 7]}
        labelBgBorderRadius={7}
      />
      <circle className="edge-particle" r="3" fill="var(--accent)">
        <animateMotion dur="3s" repeatCount="indefinite" path={path} />
      </circle>
    </>
  )
}
