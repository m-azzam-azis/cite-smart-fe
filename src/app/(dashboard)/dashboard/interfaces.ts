export interface Citation {
  id: string;
  title: string;
  authors: string | string[];
  similarityScore: number;
}

export interface ProjectSummary {
  id: string;
  title: string;
  keywords: string;
  citationCount: number;
}

export interface ProjectDetail extends ProjectSummary {
  citations: Citation[];
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}
