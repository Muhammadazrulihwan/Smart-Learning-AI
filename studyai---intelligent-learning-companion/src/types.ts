export interface DocumentChunk {
  id: string;
  page: number;
  chunk: number;
  text: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  fileType: 'PDF' | 'DOCX' | 'TXT' | 'PPTX';
  timeAgo: string;
  status: 'processed' | 'processing' | 'failed';
  pages: number;
  parsedAtText: string;
  topics: string[];
  summary: string;
  chunks: DocumentChunk[];
  progress?: number;
  iconType?: 'description' | 'menu_book' | 'article' | 'school';
}

export interface StudyTopic {
  id: string;
  priority: number;
  title: string;
  subtitle: string;
  mastery: number; // 0 to 100
  colorCategory: 'error' | 'warning' | 'success' | 'blue';
  statusIcon: string;
  aiRecommendation: string;
  documentSource?: string;
  chapter?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp?: string;
  sourceCitation?: {
    page: number;
    chunk: number;
    text?: string;
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  source: string;
}

export interface UpcomingEvent {
  id: string;
  month: string;
  day: string;
  title: string;
  inDays: string;
  type: 'exam' | 'quiz' | 'project';
}

export interface UserProfile {
  username: string;
  email: string;
  avatarUrl: string;
  isLoggedIn: boolean;
}
