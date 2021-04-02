import * as path from "path";
import * as os from "os";

export const getRelativePath = (workspaceRoot: string, commentPath: string) => {
    let relativePath = path.relative(workspaceRoot, commentPath);

  if (os.platform() === "win32") {
    relativePath = relativePath.replace(/\\/g, "/");
  }

  return relativePath;
}
