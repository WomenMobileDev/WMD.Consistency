// This file is no longer used with our custom axios interceptor implementation
// All mock responses are now defined in server.ts

// Types are kept here for reference
export interface MockHabit {
  id: number;
  user_id: number;
  name: string;
  description: string;
  color: string;
  icon: string;
  is_active: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface MockUser {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// Mock data is now managed in server.ts
// This file is kept for future reference if we need to expand mock types