import * as vscode from "vscode";
import * as path from "path";

const fromProjectRootToSherpa = (projectRoot: string): string => {
  return path.join(projectRoot, "sherpa");
};

export const getRootFolders = async (
  fsPath: string
): Promise<[string, string]> => {
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(
    vscode.Uri.file(fsPath)
  );
  if (workspaceFolder) {
    const projectRoot = workspaceFolder.uri.fsPath;
    return [projectRoot, fromProjectRootToSherpa(projectRoot)];
  } else {
    throw new Error("workspace not found");
  }
};

class SherpaConfig {}
