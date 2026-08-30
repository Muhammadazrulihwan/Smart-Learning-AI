import { apiRequest } from './client';
import { StudyPlanItem } from '../types';

export async function getStudyPlan(): Promise<StudyPlanItem[]> {
  return apiRequest<StudyPlanItem[]>('/study-plan/me');
}
