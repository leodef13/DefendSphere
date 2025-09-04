export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'link' | 'search_result';
  data?: MessageData;
}

export interface MessageData {
  url?: string;
  title?: string;
  type?: string;
  value?: any;
}

export interface AssistantRequest {
  message: string;
  userId: string;
  userRole: string;
}

export interface AssistantResponse {
  response: string;
  type: 'text' | 'link' | 'search_result';
  data?: MessageData;
}

export interface SecurityStandard {
  title: string;
  description: string;
  keyPoints: string[];
  url: string;
  category: string;
}

export interface DashboardSection {
  name: string;
  url: string;
  description: string;
}

export interface UserSearchResult {
  type: 'profile' | 'asset' | 'report';
  field?: string;
  value?: string;
  name?: string;
  status?: string;
  title?: string;
  date?: string;
  url: string;
}

export interface AssistantLog {
  timestamp: string;
  message: string;
  response: string;
  userRole: string;
}