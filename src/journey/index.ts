import * as vscode from "vscode";
import { isSherpaPath } from "../sherpa";
import { SherpaConfig } from "../utils/sherpaConfig";
import { uuid } from 'uuidv4';
import { store, setCurrentJourney, setSherpaRoot } from '../store';
import { getWorkspaceRoot } from '../utils/vscode';


export const recordJourney = async(journeyTitle: string, workspaceRoot?: vscode.Uri) => {
    
        const fsPath = getWorkspaceRoot();
        if(fsPath) {
        // Check if SherpaConfig exists
        if (await isSherpaPath(fsPath.uri.path)) {
            return;
        }
        
        const sherpaConfig = await SherpaConfig.fromFsPath(fsPath.uri.path);
        let sherpaJSON = {
            journeys: []
        };
        if(await sherpaConfig.configExists())
        sherpaJSON = await sherpaConfig.read();
        
        const journeyId = uuid();
        const newJourney = {
            metadata: {
                title: journeyTitle,
                id: journeyId
            },
            waypoints: []
        };
        
        const mergedJSON = {
            journeys: [
                ...sherpaJSON?.journeys ?? [],
                newJourney
            ]
        };
        
        setCurrentJourney(journeyId);
        setSherpaRoot(sherpaConfig.configPath);
        sherpaConfig.write(JSON.stringify(mergedJSON, null, 2));
        vscode.window.showInformationMessage(
            "Journey recording started! Begin by opening a file, clicking the + button to the left of a line of code, and add the appropriate information"
            );
            
        }
    };
    