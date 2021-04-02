import * as vscode from "vscode";
import { isSherpaPath } from "../sherpa";
import { SherpaConfig } from "../utils/sherpaConfig";
import { uuid } from 'uuidv4';
// import { normalize, schema } from 'normalizr';


/* const waypoint = new schema.Entity('waypoints');
const journeyMetadata = new schema.Entity('journeyMetadata');

const journey = new schema.Entity('journeys', {
    metadata: journeyMetadata,
    waypoints: [waypoint]
});

const sherpaSchema = new schema.Entity('sherpa', {
    journeys: [journey]
});
 */

export const recordJourney = async(journeyTitle: string, workspaceRoot?: vscode.Uri) => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const fsPath = editor.document.uri.fsPath;
      // Check if SherpaConfig exists
      if (await isSherpaPath(fsPath)) {
        return;
      }

      const sherpaConfig = await SherpaConfig.fromSherpaPath(fsPath);
      const sherpaJSON = await sherpaConfig.read();

      const newJourney = {
          metadata: {
              title: journeyTitle,
              id: uuid()
          },
          waypoints: []
      };

      const mergedJSON = {
          journeys: [
              ...sherpaJSON?.journeys ?? [],
              newJourney
          ]
      };
        sherpaConfig.write(JSON.stringify(mergedJSON, null, 2));

    }
};
