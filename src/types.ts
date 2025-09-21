export interface LoginData {
  email: string;
  password: string;
  [key: string]: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  [key: string]: string;
}

export interface FormFieldProps {
  label: string;
  type: string;
  name: string;
  value: string;
  placeholder?: string;
  error?: string;
  required: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export interface PasswordFieldProps {
  name: string;
  value: string;
  error?: string;
  required: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export interface User {
  id: number;
  email: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Book {
  id: number;
  title: string;
  authors: string[];
  description: string;
}

export interface BookSearchData {
  title: string;
  authors: string;
  [key: string]: string;
}

export interface BookSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}
