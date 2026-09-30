import { useMemo, useRef, useState } from 'react'
import { Background, Controls, ReactFlow, ReactFlowProvider } from '@xyflow/react'
import type { Edge, Node, ReactFlowInstance } from '@xyflow/react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { transformAalToGraph } from '../../core/parser/graphTransformer'
import type { AalDocument } from '../../core/types/aal.schema'
import { useStudioStore } from '../../store/useStudioStore'
import { NodeDetails } from './NodeDetails'
import { ParticleEdge } from './edges/ParticleEdge'
import { exportGraph, type ExportFormat } from './exportGraph'
import { nodeTypes } from './nodes/nodeTypes'

const edgeTypes = { particle: ParticleEdge }
const directions = [
  { value: 'LR', label: 'Left to right', icon: ArrowRight },
  { value: 'RL', label: 'Right to left', icon: ArrowLeft },
  { value: 'TB', label: 'Top to bottom', icon: ArrowDown },
  { value: 'BT', label: 'Bottom to top', icon: ArrowUp },
] as const

type Props = {
  document: AalDocument
  status: string
  editorVisible: boolean
  onToggleEditor: () => void
}

export function CanvasPanel({ document, status, editorVisible, onToggleEditor }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [exportError, setExportError] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const flowRef = useRef<ReactFlowInstance | null>(null)
  const direction = useStudioStore((state) => state.layoutDirection)
  const setDirection = useStudioStore((state) => state.setLayoutDirection)
  const theme = useStudioStore((state) => state.theme)
  const graph = useMemo(() => transformAalToGraph(document, direction), [document, direction])
  const selectedNode = graph.nodes.find((node) => node.id === selectedId)
  const nodes = useMemo(
    () => graph.nodes.map((node) => ({ ...node, selected: node.id === selectedId })),
    [graph, selectedId],
  )
  const graphKey = JSON.stringify([
    direction,
    graph.nodes.map((node) => [node.id, node.parentId, node.position, node.style?.width, node.style?.height]),
    graph.edges.map((edge) => [edge.source, edge.target]),
  ])

  async function handleExport(format: ExportFormat) {
    if (!flowRef.current || !containerRef.current || exporting) return
    setExportError(null)
    setExporting(true)
    try {
      await exportGraph(flowRef.current, containerRef.current, format, theme)
    } catch (error) {
      setExportError(error instanceof Error ? error.message : 'Could not export the image.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <section className="canvas-panel" aria-label="Architecture canvas">
      <div className="panel-heading canvas-heading">
        <span title={document.metadata.name}>{document.metadata.name}</span>
        <div className="canvas-heading-actions">
          <span className="canvas-status">{status}</span>
          <button
            className="panel-toggle"
            type="button"
            onClick={onToggleEditor}
            aria-controls="graphen-editor"
            aria-expanded={editorVisible}
            aria-label={editorVisible ? 'Hide editor' : 'Show editor'}
            title={editorVisible ? 'Hide editor' : 'Show editor'}
          >
            {editorVisible ? <PanelLeftClose size={17} /> : <PanelLeftOpen size={17} />}
          </button>
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
          <div className="export-actions" role="group" aria-label="Export architecture">
            <button type="button" disabled={exporting || !graph.nodes.length} onClick={() => void handleExport('png')} title="Export PNG at 2× resolution">PNG</button>
            <button type="button" disabled={exporting || !graph.nodes.length} onClick={() => void handleExport('svg')} title="Export SVG">SVG</button>
          </div>
        </div>
      </div>
      <div className="canvas-body" ref={containerRef}>
        <ReactFlowProvider key={graphKey}>
          <ReactFlow<Node, Edge>
            nodes={nodes}
            edges={graph.edges}
            onInit={(instance) => { flowRef.current = instance }}
            onNodeClick={(_, node) => setSelectedId(node.id)}
            onPaneClick={() => setSelectedId(null)}
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
        {!graph.nodes.length && <div className="canvas-empty">Add components in the editor to see your architecture.</div>}
        <div className="canvas-navigation-hint">Drag to pan <span aria-hidden="true">·</span> Scroll to zoom</div>
        {exportError && <div className="canvas-export-error" role="alert">{exportError}</div>}
        {selectedNode && (
          <NodeDetails node={selectedNode} onClose={() => setSelectedId(null)} />
        )}
      </div>
    </section>
  )
}
