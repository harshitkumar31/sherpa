import * as vscode from 'vscode';
import { SherpaPanel } from './SherpaPanel';
import { SidebarProvider } from './SidebarProvider';

export function activate(context: vscode.ExtensionContext) {
	

	const sidebarProvider = new SidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "sherpa-sidebar",
      sidebarProvider
    )
  );
	
	context.subscriptions.push(vscode.commands.registerCommand('sherpa.helloWorld', () => {
		SherpaPanel.createOrShow(context.extensionUri);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('sherpa.refresh', async() => {
		SherpaPanel.kill();
		SherpaPanel.createOrShow(context.extensionUri);
		setTimeout(() =>
		{		
			vscode.commands.executeCommand("workbench.action.webview.openDeveloperTools");
		}, 500);
	}));
	
	context.subscriptions.push(vscode.commands.registerCommand("sherpa.askQuestion", async() => {
		const answer = await vscode.window.showInformationMessage(
			'How was your day?',
			"good", 
			"bad");
			
			if(answer === "bad") {
				vscode.window.showInformationMessage("Sorry to hear that");
			}else {
				console.log({answer});
			}
		}));
	}
	
	// this method is called when your extension is deactivated
	export function deactivate() {}
	