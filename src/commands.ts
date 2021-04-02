import * as vscode from "vscode";
import { CommentController } from "vscode";
import { EXTENSION_NAME } from "./constants";
import { recordJourney } from "./journey";
import { isSherpaPath } from "./sherpa";
import { SherpaPanel } from "./SherpaPanel";
import { SidebarProvider } from "./SidebarProvider";
import { SherpaConfig } from "./utils/sherpaConfig";
import { createWayPoint } from "./waypoint";

export const EDITING_KEY = "sherpa:editing";
export const RECORDING_KEY = "sherpa:recording";

let commentController: CommentController | null;
export const registerCommands = (context: vscode.ExtensionContext) => {

  

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
        vscode.commands.executeCommand("setContext", RECORDING_KEY, false);
        vscode.commands.executeCommand("setContext", EDITING_KEY, false);
        commentController?.dispose();
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      `${EXTENSION_NAME}.recordJourney`,
      async(workspaceRoot?: vscode.Uri, placeHolderTitle?: string) => {
        const inputBox = vscode.window.createInputBox();
        inputBox.title =
        "Provide the title for the journey";

        inputBox.placeholder = placeHolderTitle;
      inputBox.buttons = [
        {
          iconPath: new vscode.ThemeIcon("save-as"),
          tooltip: "Save tour as..."
        }
      ];

        inputBox.onDidAccept(async () => {
          inputBox.hide();
  
          if (!inputBox.value) {
            return;
          }
  
          await recordJourney(inputBox.value, workspaceRoot);
        });

        inputBox.show();
        commentController = vscode.comments.createCommentController(
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
        vscode.commands.executeCommand("setContext", RECORDING_KEY, true);
        vscode.commands.executeCommand("setContext", EDITING_KEY, true);
      }
    )
  );
};
