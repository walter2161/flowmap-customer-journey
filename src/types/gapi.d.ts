
// Definições de tipo para a API do Google
declare interface Window {
  gapi: {
    load: (api: string, callback: () => void) => void;
    client: {
      init: (config: {
        apiKey: string;
        clientId: string;
        discoveryDocs: string[];
        scope: string;
      }) => Promise<void>;
      sheets: {
        spreadsheets: {
          get: (params: {
            spreadsheetId: string;
            ranges?: string[];
            includeGridData?: boolean;
          }) => Promise<any>;
          batchUpdate: (params: {
            spreadsheetId: string;
            resource: any;
          }) => Promise<any>;
          values: {
            get: (params: {
              spreadsheetId: string;
              range: string;
            }) => Promise<{
              result: {
                values: any[][];
              };
            }>;
            update: (params: {
              spreadsheetId: string;
              range: string;
              valueInputOption: string;
              resource: {
                values: any[][];
              };
            }) => Promise<any>;
            append: (params: {
              spreadsheetId: string;
              range: string;
              valueInputOption: string;
              insertDataOption: string;
              resource: {
                values: any[][];
              };
            }) => Promise<any>;
          };
        };
      };
    };
    auth2: {
      getAuthInstance: () => {
        isSignedIn: {
          get: () => boolean;
        };
        signIn: () => Promise<any>;
        signOut: () => Promise<void>;
      };
    };
  };
}
