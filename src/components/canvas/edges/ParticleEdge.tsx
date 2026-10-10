import { BaseEdge, getBezierPath, useInternalNode, type EdgeProps } from '@xyflow/react'
import { getFloatingEdgeParams } from './floatingEdgeUtils'

export function ParticleEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  style,
}: EdgeProps) {
  const sourceNode = useInternalNode(source)
  const targetNode = useInternalNode(target)

  let sx = sourceX
  let sy = sourceY
  let tx = targetX
  let ty = targetY
  let sp = sourcePosition
  let tp = targetPosition

  if (sourceNode && targetNode) {
    const params = getFloatingEdgeParams(sourceNode, targetNode)
    if (params) {
      sx = params.sx
      sy = params.sy
      tx = params.tx
      ty = params.ty
      sp = params.sourcePos
      tp = params.targetPos
    }
  }

  const [path, labelX, labelY] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
    sourcePosition: sp,
    targetPosition: tp,
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
