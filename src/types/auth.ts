export interface User {
  id: string;
  username: string;
  fullName?: string; // Добавляем полное имя
  email: string;
  role: 'admin' | 'user';
  permissions: string[];
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  checkPermission: (permission: string) => boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileUpdateData {
  username?: string;
  email?: string;
  fullName?: string;
  currentPassword?: string;
  newPassword?: string;
}