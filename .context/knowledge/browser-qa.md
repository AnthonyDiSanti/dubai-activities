# Browser QA availability

Consult this note when the Browser plugin cannot open the local Vite site.

## Known 23 Aug 2026 failure

- `http://127.0.0.1:4173` is explicitly allowed in `~/.codex/browser/config.toml`.
- The installed Browser client at version `26.810.52044` initializes successfully through the persistent Node REPL.
- `agent.browsers.getForUrl(...)` reports `No browser is available`, and the one permitted diagnostic call to `agent.browsers.list()` returns `[]`.
- This signature occurs before URL selection or navigation. It means the Codex desktop host did not provision an in-app or extension backend for the session; it is not a Vite, origin-policy, or application failure.

## Recovery

Reconnect or restart the Codex desktop Browser capability, then follow the installed Browser skill's selection and troubleshooting sequence. When the user has not selected a browser, allow the runtime to choose the connected backend for localhost; an `iab` backend is not required. Do not reset the same runtime repeatedly or substitute unrelated automation tools.

## Confirmed 6 Sep 2026 recovery

Restarting Codex resolved the trusted-plugin-path initialization failure. The Browser runtime selected the connected Chrome extension through `getForUrl`, and screenshots plus DOM geometry checks worked for the local production preview. Reuse that browser binding within the session. If starting Vite fails with `listen EPERM`, request sandbox escalation for the preview command; that socket restriction is separate from browser availability.
