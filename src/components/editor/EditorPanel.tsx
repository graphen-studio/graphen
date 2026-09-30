import { FileCode2 } from 'lucide-react'

export function EditorPanel() {
  return (
    <section className="editor-panel" aria-label="Code editor">
      <div className="panel-heading">
        <FileCode2 size={17} />
        <span>Editor</span>
      </div>
      <div className="editor-placeholder">
        <FileCode2 size={32} strokeWidth={1.5} />
        <h1>Build your architecture</h1>
        <p>The AAL editor will appear here in a future phase.</p>
      </div>
    </section>
  )
}
