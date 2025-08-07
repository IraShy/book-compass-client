import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { useForm } from "../hooks/useForm.ts";
import { validateEmail, validatePassword } from "../utils/validation";
import FormField from "../components/FormField.tsx";
import PasswordField from "../components/PasswordField.tsx";
import type { LoginData } from "../types.ts";

function Login() {
  const navigate = useNavigate();

  const submitHandler = async (data: LoginData) => {
    const response = await axios.post("users/login", data);
    if (response.status === 200) {
      navigate("/profile");
    }
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
          <button type="submit" className="btn w-full">
            Login
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
