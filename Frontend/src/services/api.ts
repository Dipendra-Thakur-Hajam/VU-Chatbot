// Mock API wrapper for frontend-only implementation
// This simulates API calls that would connect to a real backend

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export const api = {
  get: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    await delay(300);
    console.log(`[Mock API] GET ${endpoint}`);
    return { data: {} as T, success: true };
  },

  post: async <T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> => {
    await delay(500);
    console.log(`[Mock API] POST ${endpoint}`, body);
    return { data: {} as T, success: true };
  },

  put: async <T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> => {
    await delay(400);
    console.log(`[Mock API] PUT ${endpoint}`, body);
    return { data: {} as T, success: true };
  },

  delete: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    await delay(300);
    console.log(`[Mock API] DELETE ${endpoint}`);
    return { data: {} as T, success: true };
  },
};

export default api;
