import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import type { LoginData } from "../types.ts";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log(formData);
      const response = await axios.post(
        "http://localhost:8000/api/users/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      console.log("Login successful:", response.data);
      // TODO: Store token
      // TODO: send data to context
      // TODO: handle errors
      navigate("/profile");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Login failed:", error.response?.data);
      } else {
        console.error("Network error:", error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h2 className="title">Sign In</h2>

          <div className="form-group">
            <label htmlFor="email" className="label">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="label">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <button type="submit" className="btn-submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
