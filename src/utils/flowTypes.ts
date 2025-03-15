
import { Position } from "reactflow";

// Define a type for the card type
export type CardType = 
  | 'initial' 
  | 'message' 
  | 'question' 
  | 'condition' 
  | 'service' 
  | 'product' 
  | 'info' 
  | 'final' 
  | 'faq' 
  | 'appointment' 
  | 'promotion' 
  | 'recommendation' 
  | 'confirmation'
  | 'specialty'
  | 'insurance'
  | 'exam'
  | 'financing'
  | 'simulation'
  | 'cases'
  | 'pacotes';

// Define the flow card interface
export interface FlowCard {
  id: string;
  type: CardType;
  title: string;
  description?: string;
  content?: string;
  position: Position;
  fields: Record<string, any>;
  outputPorts: string[];
}

// Define the connection between cards
export interface FlowConnection {
  id: string;
  start: string;
  end: string;
  type: 'positive' | 'negative' | 'neutral';
  sourceHandle?: string;
  sourcePortLabel?: string;
}

// Define the assistant profile interface
export interface AssistantProfile {
  name: string;
  profession: string;
  company: string;
  contacts: string;
  guidelines: string;
  scriptGuidelines?: string[];
}

// Define the flow data interface
export interface FlowData {
  cards: FlowCard[];
  connections: FlowConnection[];
  profile?: AssistantProfile;
}
