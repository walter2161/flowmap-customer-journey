
import { GoogleSheetsConfig, GoogleSheetFlow } from './googleSheetsTypes';
import { FlowData } from './flowTypes';

// Configuração padrão para a API do Google Sheets
export const GOOGLE_SHEETS_CONFIG: GoogleSheetsConfig = {
  apiKey: 'YOUR_API_KEY', // Substitua com sua chave de API
  clientId: 'YOUR_CLIENT_ID', // Substitua com seu ID de cliente
  spreadsheetId: 'YOUR_SPREADSHEET_ID', // Substitua com o ID da sua planilha
  scope: 'https://www.googleapis.com/auth/spreadsheets',
  discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
};

// Função para inicializar a API do Google Sheets
export const initGoogleSheetsApi = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      window.gapi.load('client:auth2', async () => {
        try {
          await window.gapi.client.init({
            apiKey: GOOGLE_SHEETS_CONFIG.apiKey,
            clientId: GOOGLE_SHEETS_CONFIG.clientId,
            discoveryDocs: GOOGLE_SHEETS_CONFIG.discoveryDocs,
            scope: GOOGLE_SHEETS_CONFIG.scope,
          });
          
          console.log('Google Sheets API initialized');
          resolve(true);
        } catch (error) {
          console.error('Error initializing Google Sheets API:', error);
          resolve(false);
        }
      });
    };
    script.onerror = () => {
      console.error('Failed to load Google API script');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

// Função para verificar se o usuário está autenticado
export const isAuthenticated = (): boolean => {
  if (!window.gapi || !window.gapi.auth2) return false;
  return window.gapi.auth2.getAuthInstance().isSignedIn.get();
};

// Função para autenticar o usuário
export const authenticateUser = async (): Promise<boolean> => {
  if (!window.gapi || !window.gapi.auth2) {
    console.error('Google API não foi inicializada');
    return false;
  }
  
  try {
    const authInstance = window.gapi.auth2.getAuthInstance();
    await authInstance.signIn();
    return true;
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    return false;
  }
};

// Função para desautenticar o usuário
export const signOutUser = async (): Promise<void> => {
  if (!window.gapi || !window.gapi.auth2) return;
  
  try {
    const authInstance = window.gapi.auth2.getAuthInstance();
    await authInstance.signOut();
  } catch (error) {
    console.error('Erro ao deslogar usuário:', error);
  }
};

// Função para verificar se a planilha já existe e criar se não existir
export const setupSpreadsheet = async (): Promise<boolean> => {
  if (!isAuthenticated()) {
    console.error('Usuário não autenticado');
    return false;
  }

  try {
    // Verificar se a planilha existe
    await window.gapi.client.sheets.spreadsheets.get({
      spreadsheetId: GOOGLE_SHEETS_CONFIG.spreadsheetId,
    });
    
    // Verificar se a aba 'flows' existe
    const response = await window.gapi.client.sheets.spreadsheets.get({
      spreadsheetId: GOOGLE_SHEETS_CONFIG.spreadsheetId,
      ranges: [],
      includeGridData: false,
    });
    
    const sheets = response.result.sheets;
    let flowSheetExists = false;
    
    if (sheets) {
      for (const sheet of sheets) {
        if (sheet.properties && sheet.properties.title === 'flows') {
          flowSheetExists = true;
          break;
        }
      }
    }
    
    // Se a aba 'flows' não existir, criar
    if (!flowSheetExists) {
      await window.gapi.client.sheets.spreadsheets.batchUpdate({
        spreadsheetId: GOOGLE_SHEETS_CONFIG.spreadsheetId,
        resource: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: 'flows',
                  gridProperties: {
                    rowCount: 1000,
                    columnCount: 4,
                  },
                },
              },
            },
          ],
        },
      });
      
      // Adicionar cabeçalhos
      await window.gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: GOOGLE_SHEETS_CONFIG.spreadsheetId,
        range: 'flows!A1:D1',
        valueInputOption: 'RAW',
        resource: {
          values: [['id', 'name', 'lastModified', 'data']],
        },
      });
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao configurar planilha:', error);
    return false;
  }
};

// Função para carregar a lista de flows da planilha
export const loadFlowsList = async (): Promise<GoogleSheetFlow[]> => {
  if (!isAuthenticated()) {
    console.error('Usuário não autenticado');
    return [];
  }
  
  try {
    const response = await window.gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEETS_CONFIG.spreadsheetId,
      range: 'flows!A2:D',
    });
    
    const rows = response.result.values || [];
    
    return rows.map((row) => ({
      id: row[0],
      name: row[1],
      lastModified: row[2],
      data: row[3],
    }));
  } catch (error) {
    console.error('Erro ao carregar lista de flows:', error);
    return [];
  }
};

// Função para carregar um flow específico pelo ID
export const loadFlowById = async (flowId: string): Promise<FlowData | null> => {
  try {
    const flows = await loadFlowsList();
    const flow = flows.find(f => f.id === flowId);
    
    if (!flow) return null;
    
    return JSON.parse(flow.data) as FlowData;
  } catch (error) {
    console.error('Erro ao carregar flow:', error);
    return null;
  }
};

// Função para salvar um flow na planilha
export const saveFlow = async (
  flowId: string,
  name: string,
  flowData: FlowData
): Promise<boolean> => {
  if (!isAuthenticated()) {
    console.error('Usuário não autenticado');
    return false;
  }
  
  try {
    // Verificar se o flow já existe
    const flows = await loadFlowsList();
    const existingFlow = flows.find(f => f.id === flowId);
    
    const now = new Date().toISOString();
    const stringifiedData = JSON.stringify(flowData);
    
    if (existingFlow) {
      // Encontrar a linha do flow existente
      const flowIndex = flows.findIndex(f => f.id === flowId) + 2; // +2 porque a linha 1 é o cabeçalho
      
      // Atualizar o flow existente
      await window.gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: GOOGLE_SHEETS_CONFIG.spreadsheetId,
        range: `flows!A${flowIndex}:D${flowIndex}`,
        valueInputOption: 'RAW',
        resource: {
          values: [[flowId, name, now, stringifiedData]],
        },
      });
    } else {
      // Adicionar um novo flow
      await window.gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: GOOGLE_SHEETS_CONFIG.spreadsheetId,
        range: 'flows!A:D',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [[flowId, name, now, stringifiedData]],
        },
      });
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao salvar flow:', error);
    return false;
  }
};

// Função para excluir um flow pelo ID
export const deleteFlow = async (flowId: string): Promise<boolean> => {
  if (!isAuthenticated()) {
    console.error('Usuário não autenticado');
    return false;
  }
  
  try {
    // Carregar todos os flows
    const flows = await loadFlowsList();
    
    // Encontrar o índice do flow a ser excluído
    const flowIndex = flows.findIndex(f => f.id === flowId);
    
    if (flowIndex === -1) {
      console.error(`Flow com ID ${flowId} não encontrado`);
      return false;
    }
    
    // Remover o flow da lista
    flows.splice(flowIndex, 1);
    
    // Atualizar a planilha com a nova lista sem o flow excluído
    await window.gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: GOOGLE_SHEETS_CONFIG.spreadsheetId,
      range: 'flows!A2:D',
      valueInputOption: 'RAW',
      resource: {
        values: flows.map(f => [f.id, f.name, f.lastModified, f.data]),
      },
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao excluir flow:', error);
    return false;
  }
};
