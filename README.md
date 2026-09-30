# Graphen Studio

A visual workspace for Agent Architecture Language (AAL). Model multi-agent architectures and explore their connections on a single canvas.

## Development

Requires Node.js 22 or newer and npm.

```sh
npm ci
npm run dev
```

Run `npm run lint`, `npm test`, and `npm run build` to check the project. The landing page is at `/graphen/`; the Studio is at `/graphen/studio/`. The Monaco editor starts with the sample in `src/assets/sample.aal.yaml` and saves edits locally. Valid YAML updates the canvas after 300 ms; errors appear in the editor while the canvas keeps the last valid architecture, including after a refresh. Copy the YAML from the editor header or hide the editor to give the canvas more room. Click a component to inspect its metadata. The arrows change the layout direction without modifying the YAML. The canvas can be exported as PNG (2× resolution) or SVG.

## AAL core

`parseAal(source)` in `src/core/parser/aalParser.ts` parses YAML, validates the schema and references, and throws `AalParseError` with readable issues on failure. `transformAalToGraph(document)` in `src/core/parser/graphTransformer.ts` maps a validated document to laid-out React Flow nodes and edges. Use `.aal.yaml` for AAL files; the parser accepts YAML text regardless of the filename.

## Deployment

Push to `main` to deploy through GitHub Actions. In the repository's GitHub Pages settings, select **GitHub Actions** as the build and deployment source. Vite builds both pages as separate HTML entries so `/graphen/studio/` works on direct visits and refreshes.
