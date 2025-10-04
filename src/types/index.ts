export interface CandidateWithScore {
  id: string;
  name: string;
  email: string;
  skills: string[];
  experienceYears: number;
  score: number;
  invited: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

export interface CreateJobRequest {
  title: string;
  description: string;
  location: string;
  salaryRange: string;
  skills: string[];
}

export interface UpdateJobRequest {
  title?: string;
  description?: string;
  location?: string;
  salaryRange?: string;
  skills?: string[];
}