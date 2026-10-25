const vscode = require("vscode");

const settingName = "oneSettings.keybindings";
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const header = `// From ${settingName} in User settings. Changes will be overwritten.\n`;

exports.activate = function activate(context) {
    const target = vscode.Uri.joinPath(context.globalStoreUri, "..", "..", "keybindings.json");
    let pending = Promise.resolve();

    function sync() {
        pending = pending.then(async () => {
            let current;
            try {
                current = decoder.decode(await vscode.workspace.fs.readFile(target));
            } catch (error) {
                if (error.code !== "FileNotFound") throw error;
            }
            const value = vscode.workspace.getConfiguration().inspect(settingName)?.globalValue;
            if (value === undefined) return;
            if (
                !Array.isArray(value) ||
                value.some((entry) => !entry || typeof entry !== "object" || Array.isArray(entry))
            ) {
                throw new Error(`${settingName} must be an array of objects; file left unchanged.`);
            }
            const contents = header + JSON.stringify(value, null, 2) + "\n";
            if (current !== contents) {
                await vscode.workspace.fs.writeFile(target, encoder.encode(contents));
            }
        }).catch(console.error);
    }

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration((event) => {
            if (event.affectsConfiguration(settingName)) sync();
        }),
    );
    sync().catch(console.error);
};
