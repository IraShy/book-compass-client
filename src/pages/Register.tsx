import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useForm } from "../hooks/useForm";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "../utils/validation";
import FormField from "../components/FormField";
import PasswordField from "../components/PasswordField";
import type { RegisterData } from "../types";

function Register() {
  const navigate = useNavigate();

  const submitHandler = async (data: RegisterData) => {
    const response = await axios.post("users/register", data);
    if (response.status === 201) {
      navigate("/profile");
    }
  };

  const { formData, errors, handleChange, handleBlur, handleSubmit } =
    useForm<RegisterData>(
      {
        email: "",
        username: "",
        password: "",
      },
      {
        email: validateEmail,
        username: validateUsername,
        password: validatePassword,
      },
      submitHandler
    );

  return (
    <>
      <main className="container">
        <section className="form-container">
          <form onSubmit={handleSubmit} noValidate>
            <h2 className="title">Sign Up</h2>
            {errors.api && (
              <div className="api-error-message">{errors.api}</div>
            )}

            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              error={errors.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            <FormField
              label="Username"
              name="username"
              type="text"
              value={formData.username}
              error={errors.username}
              onChange={handleChange}
              onBlur={handleBlur}
              required={false}
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
              Register
            </button>
          </form>
        </section>
      </main>
    </>
  );
}

export default Register;
