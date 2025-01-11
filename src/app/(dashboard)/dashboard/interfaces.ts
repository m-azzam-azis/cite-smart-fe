export interface Project {
  id: string;
  title: string;
  keywords: string[];
  createdAt: string;
  citationCount: number;
  status: 'completed' | 'in_progress';
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}
