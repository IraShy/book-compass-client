import { useCallback, useRef, useState } from "react";

import axios from "../config/axios";

export function useForm<T extends Record<string, string>>(
  initialData: T,
  validationRules: Record<keyof T, (value: string) => string>,
  submitHandler: (data: T) => Promise<void>
) {
  const initialDataRef = useRef(initialData);
  const [formData, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<
    Partial<Record<keyof T | "api", string>>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field error when user starts typing
    if (errors[name as keyof T]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (errors.api) {
      setErrors((prev) => ({ ...prev, api: undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validationRules[name as keyof T]?.(value) || "";
    setErrors((prev) => ({ ...prev, [name]: error || undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const name = key as keyof T;
      const error = validationRules[name]?.(formData[name]) || "";
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const setApiError = (error: string) => {
    setErrors((prev) => ({ ...prev, api: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await submitHandler(formData);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error
          setApiError(
            error.response.data.error || "Request failed. Please try again."
          );
        } else if (error.request) {
          // Network error
          setApiError("Network error. Please check your connection.");
        } else {
          // Other axios error
          console.log(error);
          setApiError("Something went wrong. Please try again.");
        }
      } else {
        // Non-axios error
        console.log(error);
        setApiError("Something went wrong. Please try again.");
      }
    }
  };

  const resetForm = useCallback(() => {
    setFormData(initialDataRef.current);
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    handleChange,
    handleBlur,
    validateForm,
    setApiError,
    handleSubmit,
    resetForm,
  };
}
