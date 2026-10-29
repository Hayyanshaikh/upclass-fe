import type { SubjectDto } from './subjectDto';

export interface SubjectsResponseDto {
  data: SubjectDto[];
  total: number;
  message: string;
  statusCode: number;
  warning?: string;
}
