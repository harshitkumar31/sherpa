import * as vscode from 'vscode';


export const getWorkspaceRoot = () => vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders?.length > 0 ? vscode.workspace.workspaceFolders?.[0] :  undefined;
