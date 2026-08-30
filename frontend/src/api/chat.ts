import { apiRequest } from './client';
import { ChatHistoryEntry, SourceRef } from '../types';

export interface AskResponse {
  answer: string;
  sources: SourceRef[];
}

export async function askQuestion(documentId: number, question: string): Promise<AskResponse> {
  return apiRequest<AskResponse>('/chat/ask', {
    method: 'POST',
    body: { document_id: documentId, question },
  });
}

export async function getChatHistory(documentId: number): Promise<ChatHistoryEntry[]> {
  return apiRequest<ChatHistoryEntry[]>(`/chat/history/${documentId}`);
}
