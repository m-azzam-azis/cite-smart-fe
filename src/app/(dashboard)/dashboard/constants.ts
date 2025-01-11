import { ChatMessage, Project } from './interfaces';

export const DUMMY_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Deep Learning in Healthcare',
    keywords: ['AI', 'Healthcare', 'Neural Networks'],
    createdAt: '2024-01-07T10:00:00Z',
    citationCount: 15,
    status: 'completed'
  },
  {
    id: '2',
    title: 'Sustainable Energy Solutions',
    keywords: ['Renewable Energy', 'Sustainability', 'Climate Change'],
    createdAt: '2024-01-06T15:30:00Z',
    citationCount: 8,
    status: 'in_progress'
  }
];

export const DUMMY_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    content: 'Hello! How can I help you with your research today?',
    role: 'assistant',
    timestamp: '2024-01-07T09:00:00Z'
  },
  {
    id: '2',
    content: 'I need help finding papers about machine learning in healthcare',
    role: 'user',
    timestamp: '2024-01-07T09:01:00Z'
  },
  {
    id: '3',
    content: 'I can help you with that. What specific aspects of machine learning in healthcare are you interested in?',
    role: 'assistant',
    timestamp: '2024-01-07T09:01:30Z'
  }
];
