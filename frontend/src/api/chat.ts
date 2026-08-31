import { apiRequest } from './client';
import { ChatHistoryEntry, SourceRef } from '../types';

export interface AskResponse {
  answer: string;
  sources: SourceRef[];
}

/**
 * documentId undefined/null -> mode "chat umum": AI cari jawaban lintas SEMUA
 * dokumen milik user, tidak terikat satu dokumen tertentu.
 */
export async function askQuestion(question: string, documentId?: number): Promise<AskResponse> {
  return apiRequest<AskResponse>('/chat/ask', {
    method: 'POST',
    body: { document_id: documentId ?? null, question },
  });
}

export async function getChatHistory(documentId: number): Promise<ChatHistoryEntry[]> {
  return apiRequest<ChatHistoryEntry[]>(`/chat/history/${documentId}`);
}

export async function getGeneralChatHistory(): Promise<ChatHistoryEntry[]> {
  return apiRequest<ChatHistoryEntry[]>('/chat/history/general');
}
