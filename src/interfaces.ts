export interface Email {
  from: string;
  subject: string;
  message?: EmailPart;
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