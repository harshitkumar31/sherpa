import * as fs from "fs";
import { getRootFolders } from "./utils/sherpaConfig";

export const isSherpaPath = async (notePath: string): Promise<boolean> => {
  const [, noteRoot] = await getRootFolders(notePath);
  return notePath.startsWith(await noteRoot);
};
