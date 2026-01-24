// Authentication service using localStorage for mock implementation

interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
}

interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
}

const STORAGE_KEY = 'college_agent_user';

export const authService = {
  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock validation
    if (!email || !password) {
      return { success: false, message: 'Email and password are required' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Invalid credentials' };
    }

    const user: User = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0],
      role: email.includes('admin') ? 'admin' : 'student',
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return { success: true, user };
  },

  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    if (!name || !email || !password) {
      return { success: false, message: 'All fields are required' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' };
    }

    const user: User = {
      id: Date.now().toString(),
      email,
      name,
      role: email.includes('admin') ? 'admin' : 'student',
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return { success: true, user };
  },

  logout: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(STORAGE_KEY);
  },
};

export default authService;
