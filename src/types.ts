export interface LoginData {
  email: string;
  password: string;
}

export interface FormErrors {
  email?: string;
  password?: string;
  api?: string;
}

export interface FormFieldProps {
  label: string;
  type: string;
  name: string;
  value: string;
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
