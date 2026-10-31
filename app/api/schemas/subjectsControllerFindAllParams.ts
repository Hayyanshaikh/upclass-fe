/**
 * Query parameters for listing subjects.
 */
export interface SubjectsControllerFindAllParams {
  /** Filter by subject name or code (case-insensitive substring) */
  searchKey?: string;
  /** Filter by type */
  type?: string;
  /** Filter by status */
  status?: string;
  /** Number of subjects to return */
  limit?: number;
  /** Number of subjects to skip */
  offset?: number;
}
