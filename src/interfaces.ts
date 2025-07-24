export interface Email {
  from: string;
  subject: string;
  fullMessage?: EmailPart;
  rawMessage?: string;
  errorOnFetchingEmailMessage: string;
}

export interface EmailPart {
  contentType: string;
  body: string | null;
  parts?: EmailPart[];
  headers: {
    [key: string]: string[];
  };
}

export interface AIReplySettings {
    aiReplyApiKey?: string;
    aiReplyApiAddress?: string;
    aiReplyPromptMain?: string;
    aiReplyPromptFormat?: string;
    aiReplyModel?: string;
}