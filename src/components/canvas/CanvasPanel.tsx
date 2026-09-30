import { useMemo, useState } from 'react'
import { Background, Controls, ReactFlow, ReactFlowProvider } from '@xyflow/react'
import type { Node } from '@xyflow/react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react'
import sampleSource from '../../assets/sample.aal.yaml?raw'
import { parseAal } from '../../core/parser/aalParser'
import { transformAalToGraph } from '../../core/parser/graphTransformer'
import { useStudioStore } from '../../store/useStudioStore'
import { NodeDetails } from './NodeDetails'
import { ParticleEdge } from './edges/ParticleEdge'
import { nodeTypes } from './nodes/nodeTypes'

const edgeTypes = { particle: ParticleEdge }
const sampleDocument = parseAal(sampleSource)
const directions = [
  { value: 'LR', label: 'Left to right', icon: ArrowRight },
  { value: 'RL', label: 'Right to left', icon: ArrowLeft },
  { value: 'TB', label: 'Top to bottom', icon: ArrowDown },
  { value: 'BT', label: 'Bottom to top', icon: ArrowUp },
] as const

export function CanvasPanel() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const direction = useStudioStore((state) => state.layoutDirection)
  const setDirection = useStudioStore((state) => state.setLayoutDirection)
  const graph = useMemo(() => transformAalToGraph(sampleDocument, direction), [direction])

  return (
    <section className="canvas-panel" aria-label="Architecture canvas">
      <div className="panel-heading canvas-heading">
        <span>{sampleDocument.metadata.name}</span>
        <div className="canvas-heading-actions">
          <span className="canvas-status">Sample architecture</span>
          <div className="direction-switcher" role="group" aria-label="Graph direction">
            {directions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                className="direction-button"
                aria-label={label}
                title={label}
                aria-pressed={direction === value}
                onClick={() => setDirection(value)}
              >
                <Icon size={15} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="canvas-body">
        <ReactFlowProvider key={direction}>
          <ReactFlow
            nodes={graph.nodes.map((node) => ({ ...node, selected: node.id === selectedNode?.id }))}
            edges={graph.edges}
            onNodeClick={(_, node) => setSelectedNode(node)}
            onPaneClick={() => setSelectedNode(null)}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            fitViewOptions={{ padding: 0.18, maxZoom: 1 }}
            nodesDraggable={false}
            minZoom={0.15}
            maxZoom={2}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="var(--canvas-grid)" gap={24} size={1} />
            <Controls showInteractive={false} />
          </ReactFlow>
        </ReactFlowProvider>
        <div className="canvas-navigation-hint">Drag to pan <span aria-hidden="true">·</span> Scroll to zoom</div>
        {selectedNode && (
          <NodeDetails node={selectedNode} onClose={() => setSelectedNode(null)} />
        )}
      </div>
    </section>
  )
}
