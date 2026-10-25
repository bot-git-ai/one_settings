import * as vscode from "vscode";

const settingName = "oneSettings.keybindings";
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const header = `// From ${settingName} in User settings. Changes will be overwritten.\n`;

interface Entry {
  [key: string]: unknown;
}

function isEntry(value: unknown): value is Entry {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function activate(context: vscode.ExtensionContext): void {
  const target = vscode.Uri.joinPath(context.globalStorageUri, "..", "..", "keybindings.json");
  let pending: Promise<void> = Promise.resolve();

  function sync(): Promise<void> {
    pending = pending
      .then(async () => {
        let current: string | undefined;
        try {
          current = decoder.decode(await vscode.workspace.fs.readFile(target));
        } catch (error) {
          if ((error as { code?: string }).code !== "FileNotFound") throw error;
        }
        const value = vscode.workspace
          .getConfiguration()
          .inspect<unknown>(settingName)?.globalValue;
        if (value === undefined) return;
        if (!Array.isArray(value) || !value.every(isEntry)) {
          throw new Error(`${settingName} must be an array of objects; file left unchanged.`);
        }
        const contents = header + JSON.stringify(value, null, 2) + "\n";
        if (current !== contents) {
          await vscode.workspace.fs.writeFile(target, encoder.encode(contents));
        }
      })
      .catch(console.error);
    return pending;
  }

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration(settingName)) void sync();
    }),
  );
  void sync();
}
