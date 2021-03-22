import * as vscode from "vscode";
import { isSherpaPath } from "./sherpa";
import { SherpaPanel } from "./SherpaPanel";
import { SidebarProvider } from "./SidebarProvider";

export function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new SidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("sherpa-sidebar", sidebarProvider)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("sherpa.helloWorld", () => {
      SherpaPanel.createOrShow(context.extensionUri);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("sherpa.addNote", async () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const fsPath = editor.document.uri.fsPath;
        // Check if SherpaConfig exists
        if (await isSherpaPath(fsPath)) {
          return;
        }
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("sherpa.refresh", async () => {
      // SherpaPanel.kill();
      // SherpaPanel.createOrShow(context.extensionUri);

      await vscode.commands.executeCommand("workbench.action.closeSidebar");
      await vscode.commands.executeCommand(
        "workbench.view.extension.sherpa-sidebar-view"
      );
      /* setTimeout(() =>
{		
vscode.commands.executeCommand("workbench.action.webview.openDeveloperTools");
}, 500); */
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("sherpa.askQuestion", async () => {
      const answer = await vscode.window.showInformationMessage(
        "How was your day?",
        "good",
        "bad"
      );

      if (answer === "bad") {
        vscode.window.showInformationMessage("Sorry to hear that");
      } else {
        console.log({ answer });
      }
    })
  );
}

// this method is called when your extension is deactivated
export function deactivate() {
  return null;
}
