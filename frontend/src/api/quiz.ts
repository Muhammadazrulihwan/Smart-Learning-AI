import { apiRequest } from './client';
import { QuizQuestion, QuizSubmitResult } from '../types';

export async function generateQuiz(documentId: number, numQuestions = 5): Promise<QuizQuestion[]> {
  return apiRequest<QuizQuestion[]>('/quiz/generate', {
    method: 'POST',
    body: { document_id: documentId, num_questions: numQuestions },
  });
}

export async function listQuizzesForDocument(documentId: number): Promise<QuizQuestion[]> {
  return apiRequest<QuizQuestion[]>(`/quiz/document/${documentId}`);
}

export async function submitQuizAnswer(quizId: number, userAnswer: string): Promise<QuizSubmitResult> {
  return apiRequest<QuizSubmitResult>(`/quiz/${quizId}/submit`, {
    method: 'POST',
    body: { user_answer: userAnswer },
  });
}
