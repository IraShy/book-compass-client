export const validateEmail = (value: string): string => {
  if (!value.trim()) {
    return "Email is required";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Invalid email format";
  }
  return "";
};

export const validatePassword = (value: string): string => {
  if (!value.trim()) {
    return "Password is required";
  }
  if (value.length < 8) {
    return "Password must be at least 8 characters long";
  }
  return "";
};

export const validateUsername = (): string => "";
