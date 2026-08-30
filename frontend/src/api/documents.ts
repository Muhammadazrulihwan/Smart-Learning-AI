import { apiRequest } from './client';
import { DocumentItem } from '../types';

export async function uploadDocument(file: File): Promise<DocumentItem> {
  const formData = new FormData();
  formData.append('file', file);

  return apiRequest<DocumentItem>('/documents/upload', {
    method: 'POST',
    isForm: true,
    body: formData,
  });
}

export async function listDocuments(): Promise<DocumentItem[]> {
  return apiRequest<DocumentItem[]>('/documents/');
}
