# Graphen Studio

The visual studio for Agent Architecture Language (AAL). Model multi-agent architectures with a visual graph.

## Development

Requires Node.js 22 or newer and npm.

```sh
npm ci
npm run dev
```

Run `npm run lint` and `npm run build` to check the project. The landing page is at `/graphen/`; the Studio is at `/graphen/studio/`. The Studio shell includes a theme toggle (dark by default), an editor placeholder, and a single React Flow canvas. Clicking a component will open its metadata panel once AAL nodes are available. AAL parsing and editing are planned for later phases.

## Deployment

Push to `main` to deploy through GitHub Actions. In the repository's GitHub Pages settings, select **GitHub Actions** as the build and deployment source. Vite builds both pages as separate HTML entries so `/graphen/studio/` works on direct visits and refreshes.
