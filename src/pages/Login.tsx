import { Link, useNavigate } from "react-router-dom";

import { useForm } from "../hooks/useForm.ts";
import { validateEmail, validatePassword } from "../utils/validation";
import FormField from "../components/FormField.tsx";
import PasswordField from "../components/PasswordField.tsx";
import type { LoginData } from "../types.ts";
import { useUser } from "../hooks/useUser.ts";
import axios from "../config/axios";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitHandler = async (data: LoginData) => {
    setIsSubmitting(true);

    const response = await axios.post("users/login", data);
    setUser(response.data.user);
    setIsSubmitting(false);
    navigate("/profile");
  };

  const { formData, errors, handleChange, handleBlur, handleSubmit } =
    useForm<LoginData>(
      {
        email: "",
        password: "",
      },
      {
        email: validateEmail,
        password: validatePassword,
      },
      submitHandler
    );

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
          <button type="submit" className="btn w-full" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center pt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-700 hover:underline">
            Sign up
          </Link>
        </p>
      </section>
    </main>
  );
}

export default Login;
