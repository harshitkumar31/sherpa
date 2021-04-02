import {
  Comment,
  CommentAuthorInformation,
  MarkdownString,
  CommentReaction,
  CommentReply,
  CommentThread,
  CommentMode,
} from "vscode";
import { store } from '../store'
import { getRelativePath } from "../utils/path";
import * as path from "path";
import { uuid } from "uuidv4";
import { SherpaConfig } from "../utils/sherpaConfig";
import { find } from 'lodash';

let commentId = 1;
const CONTROLLER_LABEL = "sherpa";

const generatePreviewContent = (content: string) => {
  return content;
};

class SherpaComment implements Comment {
  public id: string = (++commentId).toString();
  public contextValue = "";
  public author: CommentAuthorInformation = {
    name: CONTROLLER_LABEL,
  };
  public body: MarkdownString;

  constructor(
    content: string,
    public label: string = "",
    public parent: CommentThread,
    public mode: CommentMode
  ) {
    const body =
      mode === CommentMode.Preview ? generatePreviewContent(content) : content;

    this.body = new MarkdownString(body);
    this.body.isTrusted = true;
  }
}

export const createWayPoint = async(reply: CommentReply) => {
  const state = store.getState();
  const {
    sherpaPath,
    currentJourney
  } = state;
  const thread = reply.thread;
  const filePath = getRelativePath(path.dirname(sherpaPath), thread.uri.path);

  const waypointId = uuid();
  const waypoint = {
    filePath,
    description: reply.text,
    id: waypointId
  };

  const sherpaConfig = await SherpaConfig.fromSherpaConfigPath(state.sherpaPath);
  let sherpaJSON = await sherpaConfig.read();

  const currentJourneyJSON = find(sherpaJSON.journeys, (j) => j.metadata.id === currentJourney);
  currentJourneyJSON.waypoints = [...currentJourneyJSON.waypoints, waypoint];
  
  const newComment = new SherpaComment(
    reply.text,
    undefined,
    thread,
    CommentMode.Preview
  );
  if (thread.contextValue === "draft") {
    newComment.label = "pending";
  }

  thread.comments = [...thread.comments, newComment];
  sherpaConfig.write(JSON.stringify(sherpaJSON, null, 2));
};
