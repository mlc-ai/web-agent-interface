export interface GoogleCalendarParams {
  credentials?: {
    clientEmail?: string;
    privateKey?: string;
  };
  scopes?: string[];
}
