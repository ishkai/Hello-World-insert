import * as vscode from "vscode";
let disposableChange: vscode.Disposable | undefined; 
export function activate(context: vscode.ExtensionContext) {
  let enableDisposable = vscode.commands.registerCommand(
    "helloWorldMode.enable",
    () => {
      vscode.window.showInformationMessage("Hello World Mode Enabled!");

      if (disposableChange) {
        vscode.window.showInformationMessage("Hello World Mode is already enabled.");
        return;
      }

      disposableChange = vscode.workspace.onDidChangeTextDocument((event) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor || event.contentChanges.length === 0) {
          return;
        }

        const change = event.contentChanges[0];
        if (change.text.length === 1) {
          editor.edit((editBuilder) => {
            const range = change.range;
            editBuilder.replace(range, "Hello, World!");
          });
        }
      });

      context.subscriptions.push(disposableChange);
    }
  );

  let disableDisposable = vscode.commands.registerCommand(
    "helloWorldMode.disable",
    () => {
      if (disposableChange) {
        disposableChange.dispose(); 
        disposableChange = undefined;
        vscode.window.showInformationMessage("Hello World Mode Disabled!");
      } else {
        vscode.window.showInformationMessage("Hello World Mode is not enabled.");
      }
    }
  );

  context.subscriptions.push(enableDisposable, disableDisposable);
}
export function deactivate() {
  if (disposableChange) {
    disposableChange.dispose(); 
  }
}
