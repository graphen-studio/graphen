import { useEffect, useRef, useState } from 'react'
import Editor, { loader, type BeforeMount, type OnMount } from '@monaco-editor/react'
import { Check, Copy, FileCode2 } from 'lucide-react'
import * as monaco from 'monaco-editor/editor/editor.api'
import type { editor } from 'monaco-editor'
import EditorWorker from 'monaco-editor/editor/editor.worker.js?worker'
import type { AalParseError } from '../../core/parser/aalParser'
import { useStudioStore } from '../../store/useStudioStore'

(self as typeof self & { MonacoEnvironment: { getWorker: () => Worker } }).MonacoEnvironment = {
  getWorker: () => new EditorWorker(),
}
loader.config({ monaco })

const configureEditor: BeforeMount = (api) => {
  if (!api.languages.getLanguages().some((language: { id: string }) => language.id === 'aal-yaml')) {
    api.languages.register({ id: 'aal-yaml' })
    api.languages.setLanguageConfiguration('aal-yaml', {
      comments: { lineComment: '#' },
      brackets: [['[', ']'], ['{', '}']],
    })
    api.languages.setMonarchTokensProvider('aal-yaml', {
      tokenizer: {
        root: [
          [/\s*#.*/, 'comment'],
          [/[\w-]+(?=\s*:)/, 'key'],
          [/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/, 'string'],
          [/\b(?:true|false|null)\b/, 'keyword'],
          [/\b\d+(?:\.\d+)?\b/, 'number'],
        ],
      },
    })
  }

  api.editor.defineTheme('graphen-dark', {
    base: 'vs-dark', inherit: true,
    rules: [
      { token: 'key', foreground: '7dd3fc' },
      { token: 'string', foreground: 'a7f3d0' },
      { token: 'number', foreground: 'fbbf24' },
      { token: 'keyword', foreground: 'c4b5fd' },
      { token: 'comment', foreground: '778397' },
    ],
    colors: {
      'editor.background': '#12141c',
      'editor.foreground': '#f3f4f6',
      'editorGutter.background': '#12141c',
      'editorLineNumber.foreground': '#69758a',
      'editorCursor.foreground': '#60a5fa',
    },
  })
  api.editor.defineTheme('graphen-light', {
    base: 'vs', inherit: true,
    rules: [
      { token: 'key', foreground: '1d4ed8' },
      { token: 'string', foreground: '047857' },
      { token: 'number', foreground: 'b45309' },
      { token: 'keyword', foreground: '7c3aed' },
      { token: 'comment', foreground: '778397' },
    ],
    colors: {
      'editor.background': '#ffffff',
      'editor.foreground': '#171d2b',
      'editorGutter.background': '#ffffff',
      'editorLineNumber.foreground': '#8490a3',
      'editorCursor.foreground': '#2563eb',
    },
  })
}

type Props = { error: AalParseError | null }

function applyDiagnostics(
  instance: editor.IStandaloneCodeEditor,
  decorations: editor.IEditorDecorationsCollection,
  error: AalParseError | null,
) {
  const model = instance.getModel()
  if (!model) return

  const location = error?.location
  monaco.editor.setModelMarkers(model, 'aal', location ? [{
    startLineNumber: location.line,
    startColumn: location.column,
    endLineNumber: location.line,
    endColumn: location.column + 1,
    message: error.issues[0],
    severity: monaco.MarkerSeverity.Error,
  }] : [])
  decorations.set(location ? [{
    range: new monaco.Range(location.line, 1, location.line, 1),
    options: {
      isWholeLine: true,
      glyphMarginClassName: 'aal-error-glyph',
      glyphMarginHoverMessage: { value: error.issues[0] },
    },
  }] : [])
}

export default function EditorPanel({ error }: Props) {
  const source = useStudioStore((state) => state.source)
  const setSource = useStudioStore((state) => state.setSource)
  const theme = useStudioStore((state) => state.theme)
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const decorationsRef = useRef<editor.IEditorDecorationsCollection | null>(null)
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')
  const copyTimeout = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(copyTimeout.current), [])

  async function copyYaml() {
    window.clearTimeout(copyTimeout.current)
    try {
      await navigator.clipboard.writeText(source)
      setCopyState('copied')
    } catch {
      setCopyState('error')
    }
    copyTimeout.current = window.setTimeout(() => setCopyState('idle'), 2000)
  }

  const onMount: OnMount = (instance) => {
    editorRef.current = instance
    decorationsRef.current = instance.createDecorationsCollection()
    applyDiagnostics(instance, decorationsRef.current, error)
  }

  useEffect(() => {
    const instance = editorRef.current
    const decorations = decorationsRef.current
    if (instance && decorations) applyDiagnostics(instance, decorations, error)
  }, [error])

  return (
    <section className="editor-panel" id="graphen-editor" aria-label="Code editor">
      <div className="panel-heading editor-heading">
        <FileCode2 size={17} />
        <span>architecture.aal.yaml</span>
        <span className={`editor-status${error ? ' is-error' : ''}`}>{error ? 'Invalid AAL' : 'Saved locally'}</span>
        <span className="copy-feedback" aria-live="polite">
          {copyState === 'copied' ? 'Copied' : copyState === 'error' ? 'Copy failed' : ''}
        </span>
        <button
          className="editor-copy-button"
          type="button"
          onClick={() => void copyYaml()}
          aria-label="Copy YAML to clipboard"
          title="Copy YAML"
        >
          {copyState === 'copied' ? <Check size={15} /> : <Copy size={15} />}
        </button>
      </div>
      <div className="editor-body">
        <Editor
          language="aal-yaml"
          theme={`graphen-${theme}`}
          value={source}
          onChange={(value) => {
            setCopyState('idle')
            setSource(value ?? '')
          }}
          beforeMount={configureEditor}
          onMount={onMount}
          loading={<span className="editor-loading">Loading editor…</span>}
          options={{
            minimap: { enabled: false },
            glyphMargin: true,
            fontSize: 13,
            lineHeight: 21,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 14, bottom: 14 },
          }}
        />
      </div>
      {error && (
        <div className="editor-diagnostics" role="alert">
          {error.issues.map((issue, index) => <div key={`${index}-${issue}`}>{issue}</div>)}
        </div>
      )}
    </section>
  )
}
