import * as vscode from "vscode";
import { EXTENSION_NAME } from "./constants";
import { isSherpaPath } from "./sherpa";
import { SherpaPanel } from "./SherpaPanel";
import { SidebarProvider } from "./SidebarProvider";
import { SherpaConfig } from "./utils/sherpaConfig";
import { createWayPoint } from "./waypoint";

export const registerCommands = (context: vscode.ExtensionContext) => {
  const commentController = vscode.comments.createCommentController(
    "sherpa-comment",
    "Comment API Sample"
  );
  context.subscriptions.push(commentController);

  commentController.commentingRangeProvider = {
    provideCommentingRanges: (
      document: vscode.TextDocument,
      token: vscode.CancellationToken
    ) => {
      const lineCount = document.lineCount;
      return [new vscode.Range(0, 0, lineCount - 1, 0)];
    },
  };

  const sidebarProvider = new SidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("sherpa-sidebar", sidebarProvider)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(`${EXTENSION_NAME}.helloWorld`, () => {
      SherpaPanel.createOrShow(context.extensionUri);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      `${EXTENSION_NAME}.addWaypoint`,
      async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          const fsPath = editor.document.uri.fsPath;
          // Check if SherpaConfig exists
          if (await isSherpaPath(fsPath)) {
            return;
          }

          const sherpaConfig = await SherpaConfig.fromSherpaPath(fsPath);

          const text = editor.document.getText(editor.selection);

          sidebarProvider._view?.webview.postMessage({
            type: "addNote",
            sherpaConfig: await sherpaConfig.read(),
          });

          if (!(await sherpaConfig.configExists())) {
            sherpaConfig.write(JSON.stringify({}));
          }
        }
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(`${EXTENSION_NAME}.refresh`, async () => {
      await vscode.commands.executeCommand("workbench.action.closeSidebar");
      await vscode.commands.executeCommand(
        "workbench.view.extension.sherpa-sidebar-view"
      );
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      `${EXTENSION_NAME}.createWaypoint`,
      (reply: vscode.CommentReply) => {
        createWayPoint(reply);
      }
    )
  );
};
