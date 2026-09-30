# Graphen Studio

A visual workspace for Agent Architecture Language (AAL). Model multi-agent architectures and explore their connections on a single canvas.

## Development

Requires Node.js 22 or newer and npm.

```sh
npm ci
npm run dev
```

Run `npm run lint`, `npm test`, and `npm run build` to check the project. The landing page is at `/graphen/`; the Studio is at `/graphen/studio/`. The Studio shows the versioned sample in `src/assets/sample.aal.yaml` on an interactive canvas with dark/light themes. Click a component to inspect its metadata. The arrows in the canvas header change the automatic layout direction without changing the YAML; the preference is saved locally. YAML editing is planned for a later phase.

## AAL core

`parseAal(source)` in `src/core/parser/aalParser.ts` parses YAML, validates the schema and references, and throws `AalParseError` with readable issues on failure. `transformAalToGraph(document)` in `src/core/parser/graphTransformer.ts` maps a validated document to laid-out React Flow nodes and edges. Use `.aal.yaml` for AAL files; the parser accepts YAML text regardless of the filename. Integration with the editor and custom node rendering comes in later phases.

## Deployment

Push to `main` to deploy through GitHub Actions. In the repository's GitHub Pages settings, select **GitHub Actions** as the build and deployment source. Vite builds both pages as separate HTML entries so `/graphen/studio/` works on direct visits and refreshes.
