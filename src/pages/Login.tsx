import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import type { LoginData, FormErrors } from "../types.ts";
import FormField from "../components/FormField.tsx";
import PasswordField from "../components/PasswordField.tsx";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (errors.api) {
      console.error("API error:", errors.api);
    }
  }, [errors.api]);

  // Validation for individual form fields
  const validateField = (name: keyof LoginData, value: string): string => {
    let error = "";
    if (name === "email") {
      if (!value.trim()) {
        error = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        error = "Please enter a valid email address";
      }
    } else if (name === "password" && !value.trim()) {
      error = "Password is required";
    }
    return error;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const name = key as keyof LoginData;
      const value = formData[name];
      const error = validateField(name, value);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (errors.api) {
      setErrors((prev) => ({ ...prev, api: undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email" || name === "password") {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error || undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors((prev) => ({ ...prev, api: undefined }));

    try {
      console.log("Form data:", formData);

      if (!validateForm()) {
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/api/users/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      console.log("Login successful:", response.data);
      setErrors({});
      // TODO: Store token
      // TODO: send data to context
      navigate("/profile");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.message;
        setErrors((prev) => ({ ...prev, api: errorMessage }));
      } else {
        console.error("Network error:", error);
        setErrors((prev) => ({
          ...prev,
          api: "Something went wrong. Please try again",
        }));
      }
    }
  };

  return (
    <main className="container">
      <section className="form-container">
        <form onSubmit={handleSubmit} noValidate>
          <h2 className="title">Sign In</h2>
          {errors.api && <div className="api-error-message">{errors.api}</div>}
          <FormField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            error={errors.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          <PasswordField
            name="password"
            value={formData.password}
            error={errors.password}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          <button type="submit" className="btn w-full">
            Login
          </button>
        </form>

        <Link to="/signup">Sign up</Link>
      </section>
    </main>
  );
}

export default Login;
