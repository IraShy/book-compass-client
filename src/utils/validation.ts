const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 64;

export const validatePresence = (value: string, fieldName: string): string => {
  return value.trim() ? "" : `${fieldName} is required`;
};

export const validateEmail = (value: string): string => {
  const presenceError = validatePresence(value, "Email");
  if (presenceError) return presenceError;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Invalid email format";
  }
  return "";
};

export const validatePassword = (value: string): string => {
  const presenceError = validatePresence(value, "Password");
  if (presenceError) return presenceError;

  if (value.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`;
  }
  if (value.length > MAX_PASSWORD_LENGTH) {
    return `Password must be no more than ${MAX_PASSWORD_LENGTH} characters long`;
  }
  return "";
};
