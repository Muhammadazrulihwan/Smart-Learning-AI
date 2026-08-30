// Tipe-tipe ini dibuat 1:1 mengikuti response schema backend FastAPI
// (lihat backend/app/schemas.py) - bukan lagi mock/aspirational data.

export interface UserProfile {
  id: number;
  username: string;
  email: string;
}

export type DocumentStatus = 'pending' | 'processed' | 'failed';

export interface DocumentItem {
  id: number;
  original_name: string;
  status: DocumentStatus;
  chunk_count: number | null;
}

export interface SourceRef {
  source_name: string;
  chunk_index: number;
}

export interface ChatMessage {
  // id lokal (frontend-only) untuk key React, bukan dari backend
  localId: string;
  sender: 'ai' | 'user';
  text: string;
  sources?: SourceRef[];
}

export interface ChatHistoryEntry {
  id: number;
  document_id: number;
  question: string;
  answer: string;
  sources: string; // JSON string dari backend, di-parse saat dipakai
  created_at: string;
}

export interface QuizQuestion {
  id: number;
  topic: string | null;
  question_type: string;
  question: string;
  options: string[] | null;
}

export interface QuizSubmitResult {
  is_correct: boolean;
  correct_answer: string;
  explanation: string | null;
}

export interface StudyPlanItem {
  topic: string;
  priority: number;
  recommendation: string | null;
}
