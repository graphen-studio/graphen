import { CanvasPanel } from './components/canvas/CanvasPanel'
import { EditorPanel } from './components/editor/EditorPanel'
import { TopBar } from './components/ui/TopBar'

export default function App() {
  return (
    <div className="app-shell">
      <TopBar />
      <main className="workspace">
        <EditorPanel />
        <CanvasPanel />
      </main>
    </div>
  )
}
