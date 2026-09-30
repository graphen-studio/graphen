import { useState } from 'react'
import { Background, ReactFlow, ReactFlowProvider } from '@xyflow/react'
import type { Node } from '@xyflow/react'
import { NodeDetails } from './NodeDetails'

export function CanvasPanel() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

  return (
    <section className="canvas-panel" aria-label="Architecture canvas">
      <div className="panel-heading canvas-heading">
        <span>Architecture</span>
        <span className="canvas-status">Canvas ready</span>
      </div>
      <div className="canvas-body">
        <ReactFlowProvider>
          <ReactFlow
            nodes={[]}
            edges={[]}
            onNodeClick={(_, node) => setSelectedNode(node)}
            onPaneClick={() => setSelectedNode(null)}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="var(--canvas-grid)" gap={24} size={1} />
          </ReactFlow>
        </ReactFlowProvider>
        <div className="canvas-placeholder">
          <span className="canvas-placeholder-icon" aria-hidden="true">◇</span>
          <h2>Your architecture starts here</h2>
          <p>Your system graph will appear here when you add AAL components.</p>
        </div>
        {selectedNode && (
          <NodeDetails node={selectedNode} onClose={() => setSelectedNode(null)} />
        )}
      </div>
    </section>
  )
}
