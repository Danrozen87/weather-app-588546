
export interface BaseComponent {
  id: string;
  className?: string;
  children?: React.ReactNode;
}

export interface ApiResponse<T = any> {
  data: T;
  error?: string;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
  mode: 'light' | 'dark';
}

export type Status = 'success' | 'error' | 'warning' | 'info' | 'default';
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type Variant = 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
