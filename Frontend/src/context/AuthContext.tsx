import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('college_agent_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock users
    const mockUsers = [
      { id: '1', email: 'admin@college.edu', password: 'admin123', name: 'Admin User', role: 'admin' as const },
      { id: '2', email: 'student@college.edu', password: 'student123', name: 'John Student', role: 'student' as const },
    ];

    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('college_agent_user', JSON.stringify(userWithoutPassword));
      return true;
    }

    // Allow any email/password for demo purposes
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0],
      role: email.includes('admin') ? 'admin' : 'student',
    };
    setUser(newUser);
    localStorage.setItem('college_agent_user', JSON.stringify(newUser));
    return true;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: email.includes('admin') ? 'admin' : 'student',
    };
    
    setUser(newUser);
    localStorage.setItem('college_agent_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('college_agent_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
