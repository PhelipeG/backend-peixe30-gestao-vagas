export const errorSchema = {
  type: 'object',
  properties: {
    error: { type: 'boolean' },
    message: { type: 'string' },
    statusCode: { type: 'number' }
  }
} as const;

export const userSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    email: { type: 'string', format: 'email' },
    createdAt: { type: 'string', format: 'date-time' }
  }
} as const;

export const jobSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    description: { type: 'string' },
    location: { type: 'string' },
    salaryRange: { type: 'string' },
    skills: { 
      type: 'array', 
      items: { type: 'string' } 
    },
    createdAt: { type: 'string', format: 'date-time' }
  }
} as const;

export const candidateSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    skills: { 
      type: 'array', 
      items: { type: 'string' } 
    },
    experienceYears: { type: 'number' },
    score: { type: 'number', minimum: 0, maximum: 100 }
  }
} as const;

export const paginationSchema = {
  type: 'object',
  properties: {
    page: { type: 'number' },
    limit: { type: 'number' },
    total: { type: 'number' },
    totalPages: { type: 'number' }
  }
} as const;