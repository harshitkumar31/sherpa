import {
  Comment,
  CommentAuthorInformation,
  MarkdownString,
  CommentReaction,
  CommentReply,
  CommentThread,
  CommentMode,
} from "vscode";

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

export const createWayPoint = (reply: CommentReply) => {
  const thread = reply.thread;
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
};
