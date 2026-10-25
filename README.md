# One Settings

A VS Code extension that keeps the Default profile's `keybindings.json` in one place: a User setting.

`keybindings.json` is per-profile, so with more than one profile your keybindings either drift apart or become copies to maintain. This extension defines them once as the `oneSettings.keybindings` User setting (application-scoped, so the same everywhere) and writes them into the Default profile's `keybindings.json`.

## Usage

Set `oneSettings.keybindings` in your User settings (JSON) to the keybindings you want — same shape as entries in `keybindings.json`:

```json
{
  "oneSettings.keybindings": [
    { "key": "ctrl+shift+p", "command": "workbench.action.showCommands" }
  ]
}
```

On startup, and whenever the setting changes, the extension replaces the Default profile's `keybindings.json` with this array (with a comment header marking the file as generated). Unset leaves the file alone; `[]` clears it. A malformed value is reported and the file is left unchanged.

## Install

- From Releases: download the newest VSIX and install it via Extensions → ⋯ → *Install from VSIX…*
- Build it yourself: `npm ci && npm run package` (or `make vsix`)

Every push to the `master` branch is packaged automatically and attached to a GitHub release, tagged after the `package.json` version.

## License

[AGPL-3.0](LICENSE)
