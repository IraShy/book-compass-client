import { useEffect } from "react";
import axios from "../config/axios";
import { useForm } from "../hooks/useForm";
import { useUser } from "../hooks/useUser";

import type { BaseModalProps, User } from "../types";
import { validateEmail, validatePassword } from "../utils/validation";
import Modal from "./Modal";
import FormField from "./FormField";
function UpdateEmailModal({ isOpen, closeModal }: BaseModalProps) {
  const { setUser } = useUser();

  const submitHandler = async (data: { email: string; password: string }) => {
    const response = await axios.put("users/profile", {
      email: data.email,
      password: data.password,
    });
    setUser(response.data.user);
    closeModal();
  };

  const {
    formData,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  } = useForm<
    Pick<User, "email"> & { password: string } & { [key: string]: string }
  >(
    { email: "", password: "" },
    {
      email: (value) => validateEmail(value),
      password: (value) => validatePassword(value),
    },
    submitHandler
  );

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} closeModal={closeModal} title="Update Email">
      <section className="form-container">
        <form onSubmit={handleSubmit} noValidate>
          {errors.api && (
            <div className="api-error-message" role="alert" id="api-error">
              {errors.api}
            </div>
          )}
          <FormField
            label="New Email"
            type="email"
            name="email"
            value={formData.email}
            error={errors.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          <FormField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            helptext="Enter your current password"
            error={errors.password}
            onChange={handleChange}
            onBlur={handleBlur}
            showPasswordToggle={true}
            required
          />
          <button
            type="submit"
            className="btn w-full"
            aria-describedby={errors.api ? "api-error" : undefined}
          >
            Update
          </button>
        </form>
      </section>
    </Modal>
  );
}

export default UpdateEmailModal;
