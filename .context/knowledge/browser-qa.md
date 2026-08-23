# Browser QA availability

Consult this note when the Browser plugin cannot open the local Vite site.

## Known 23 Aug 2026 failure

- `http://127.0.0.1:4173` is explicitly allowed in `~/.codex/browser/config.toml`.
- The installed Browser client at version `26.810.52044` initializes successfully through the persistent Node REPL.
- `agent.browsers.getForUrl(...)` reports `No browser is available`, and the one permitted diagnostic call to `agent.browsers.list()` returns `[]`.
- This signature occurs before URL selection or navigation. It means the Codex desktop host did not provision an in-app or extension backend for the session; it is not a Vite, origin-policy, or application failure.

## Recovery

Reconnect or restart the Codex desktop Browser capability, then start a fresh Browser runtime and confirm that `agent.browsers.list()` contains an `iab` backend before opening localhost. Follow the installed Browser skill's discovery and troubleshooting sequence. Do not reset the same runtime repeatedly or substitute standalone Playwright, Chrome, Computer Use, or shell screenshots when the Browser skill is the requested testing surface.
