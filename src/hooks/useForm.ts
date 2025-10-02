import { useCallback, useRef, useState, useEffect } from "react";
import axios from "../config/axios";

type FieldValidator = (value: string) => string;
type CrossValidator<T> = (formData: T) => Partial<Record<keyof T, string>>;

export function useForm<T extends Record<string, string>>(
  initialData: T,
  fieldValidators: Record<keyof T, FieldValidator>,
  submitHandler: (data: T) => Promise<void>,
  crossValidator?: CrossValidator<T>,
  options?: {
    debounceDelay?: number;
    triggerFields?: (keyof T)[];
  }
) {
  const { debounceDelay = 300, triggerFields } = options || {};

  const initialDataRef = useRef(initialData);
  const [formData, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<
    Partial<Record<keyof T | "api", string>>
  >({});
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const debouncedCrossValidation = useCallback(
    (data: T) => {
      if (!crossValidator) return;

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        const crossFieldErrors = crossValidator(data);
        setErrors((prev) => ({ ...prev, ...crossFieldErrors }));
      }, debounceDelay);
    },
    [crossValidator, debounceDelay]
  );

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

    if (crossValidator) {
      const currentErrors = crossValidator(formData);
      const newErrors = crossValidator(newFormData);

      const clearedFields = Object.keys(currentErrors).filter(
        (key) => currentErrors[key as keyof T] && !newErrors[key as keyof T]
      );

      if (clearedFields.length > 0) {
        setErrors((prev) => {
          const updated = { ...prev };
          clearedFields.forEach((field) => {
            updated[field as keyof T] = undefined;
          });
          return updated;
        });
      }
    }

    const shouldTriggerCrossValidation =
      triggerFields && triggerFields.includes(name as keyof T);

    if (shouldTriggerCrossValidation) {
      debouncedCrossValidation(newFormData);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const error = fieldValidators[name as keyof T]?.(value) || "";
    setErrors((prev) => ({ ...prev, [name]: error || undefined }));

    if (crossValidator) {
      const crossFieldErrors = crossValidator(formData);
      setErrors((prev) => ({ ...prev, ...crossFieldErrors }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const name = key as keyof T;
      const error = fieldValidators[name]?.(formData[name]) || "";
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    if (crossValidator) {
      const crossFieldErrors = crossValidator(formData);
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

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

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
          setApiError("Something went wrong. Please try again.");
        }
      } else {
        setApiError("Something went wrong. Please try again.");
      }
    }
  };

  const resetForm = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    setFormData(initialDataRef.current);
    setErrors({});
  }, []);

  const isFormValid = () => {
    const hasAllValues = Object.values(formData).every(
      (value) => value.trim() !== ""
    );
    if (!hasAllValues) return false;

    const hasErrors = Object.keys(errors).some(
      (key) => key !== "api" && errors[key as keyof T]
    );
    if (hasErrors) return false;

    const tempErrors: Partial<Record<keyof T, string>> = {};
    Object.keys(formData).forEach((key) => {
      const name = key as keyof T;
      const error = fieldValidators[name]?.(formData[name]) || "";
      if (error) tempErrors[name] = error;
    });

    if (crossValidator) {
      const crossFieldErrors = crossValidator(formData);
      Object.assign(tempErrors, crossFieldErrors);
    }

    return Object.keys(tempErrors).length === 0;
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
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
    isFormValid,
  };
}
