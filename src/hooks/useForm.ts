import { useCallback, useRef, useState } from "react";
import axios from "../config/axios";

type ValidationRule<T> = (value: string, formData: T) => string;
type CrossFieldValidator<T> = (formData: T) => Partial<Record<keyof T, string>>;

export function useForm<T extends Record<string, string>>(
  initialData: T,
  validationRules: Record<keyof T, ValidationRule<T>>,
  submitHandler: (data: T) => Promise<void>,
  crossFieldValidator?: CrossFieldValidator<T>
) {
  const initialDataRef = useRef(initialData);
  const [formData, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<
    Partial<Record<keyof T | "api", string>>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    if (errors[name as keyof T]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (errors.api) {
      setErrors((prev) => ({ ...prev, api: undefined }));
    }

    if (crossFieldValidator) {
      const crossFieldErrors = crossFieldValidator(newFormData);
      setErrors((prev) => ({ ...prev, ...crossFieldErrors }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const error = validationRules[name as keyof T]?.(value, formData) || "";
    setErrors((prev) => ({ ...prev, [name]: error || undefined }));

    if (crossFieldValidator) {
      const crossFieldErrors = crossFieldValidator(formData);
      setErrors((prev) => ({ ...prev, ...crossFieldErrors }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const name = key as keyof T;
      const error = validationRules[name]?.(formData[name], formData) || "";
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    if (crossFieldValidator) {
      const crossFieldErrors = crossFieldValidator(formData);
      Object.keys(crossFieldErrors).forEach((key) => {
        const error = crossFieldErrors[key as keyof T];
        if (error) {
          newErrors[key as keyof T] = error;
          isValid = false;
        }
      });
    }

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
          setApiError(
            error.response.data.error || "Request failed. Please try again."
          );
        } else if (error.request) {
          setApiError("Network error. Please check your connection.");
        } else {
          console.log(error);
          setApiError("Something went wrong. Please try again.");
        }
      } else {
        console.log(error);
        setApiError("Something went wrong. Please try again.");
      }
    }
  };

  const resetForm = useCallback(() => {
    setFormData(initialDataRef.current);
    setErrors({});
  }, []);

  const isFormValid = () => {
    const hasErrors = Object.keys(errors).some(
      (key) => key !== "api" && errors[key as keyof T]
    );

    return !hasErrors;
  };

  return {
    formData,
    errors,
    handleChange,
    handleBlur,
    setApiError,
    handleSubmit,
    resetForm,
    isFormValid,
  };
}
