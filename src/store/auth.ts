import { create } from 'zustand';
import { User, UserRole } from '../types';

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: UserRole.ENDUSER,
    campusId: '1',
    department: 'Finance',
    position: 'Accountant',
    profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: UserRole.ITSTAFF,
    campusId: '1',
    department: 'IT',
    position: 'Support Specialist',
    profileImage: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    role: UserRole.SUPERVISOR,
    campusId: '1',
    department: 'IT',
    position: 'IT Supervisor',
    profileImage: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    role: UserRole.MANAGER,
    campusId: '1',
    department: 'IT',
    position: 'IT Manager',
    profileImage: 'https://randomuser.me/api/portraits/women/4.jpg',
  },
];

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchUser: (userId: string) => void; // For demonstration purposes
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const user = mockUsers.find((u) => u.email === email);
      
      if (user && password === 'password') { // Simple mock authentication
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ error: 'Invalid email or password', isLoading: false });
      }
    } catch (error) {
      set({ error: 'Authentication failed', isLoading: false });
    }
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  switchUser: (userId) => {
    const user = mockUsers.find((u) => u.id === userId);
    if (user) {
      set({ user, isAuthenticated: true });
    }
  },
}));