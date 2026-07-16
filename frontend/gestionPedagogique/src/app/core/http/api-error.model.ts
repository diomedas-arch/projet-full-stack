export interface ApiError {
  timestamp?: string;
  status: number;
  erreur?: string;
  message: string;
  chemin?: string;
  details?: Record<string, string>;
}
