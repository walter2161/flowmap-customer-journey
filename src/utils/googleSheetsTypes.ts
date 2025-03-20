
export interface GoogleSheetFlow {
  id: string;
  name: string;
  lastModified: string;
  data: string; // Flow data JSON stringified
}

export interface GoogleSheetsConfig {
  apiKey: string;
  clientId: string;
  spreadsheetId: string;
  scope: string;
  discoveryDocs: string[];
}

export interface GoogleAuthResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}
