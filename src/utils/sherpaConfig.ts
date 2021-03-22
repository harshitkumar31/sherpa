import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs-extra";

const fromProjectRootToSherpa = (projectRoot: string): string => {
  return path.join(projectRoot, "sherpa.json");
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

export interface Props {
  configPath: string;
}

export class SherpaConfig implements Props {
  configPath: string;

  constructor(props: Props) {
    this.configPath = props.configPath;
  }

  async configExists(): Promise<boolean> {
    try {
      await fs.stat(this.configPath);
      return true;
    } catch (err) {
      return false;
    }
  }

  static async fromSherpaPath(sherpaPath: string) {
    const [projectRoot, sherpaConfigPath] = await getRootFolders(sherpaPath);

    return new SherpaConfig({
      configPath: sherpaConfigPath,
    });
  }

  async read(): Promise<string> {
    const buffer = await fs.readFile(this.configPath);
    return buffer.toString();
  }

  async write(body: string): Promise<void> {
    return await fs.outputFile(this.configPath, body);
  }

  async open(): Promise<void> {
    await vscode.commands.executeCommand(
      "vscode.open",
      vscode.Uri.file(this.configPath),
      {
        viewColumn: vscode.ViewColumn.Beside,
        preview: false,
      }
    );
  }
}
