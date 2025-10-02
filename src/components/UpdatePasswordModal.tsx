import { useEffect } from "react";
import axios from "../config/axios";

import type { BaseModalProps } from "../types";
import { validatePassword, validatePresence } from "../utils/validation";
import { useForm } from "../hooks/useForm";
import Modal from "./Modal";
import FormField from "./FormField";

function UpdatePasswordlModal({ isOpen, closeModal }: BaseModalProps) {
  const submitHandler = async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    console.log(formData);
    const response = await axios.put("users/password", {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    if (response.status === 200) closeModal();
  };

  const {
    formData,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    isFormValid,
  } = useForm(
    { currentPassword: "", newPassword: "", confirmPassword: "" },
    {
      currentPassword: (value) => validatePassword(value),
      newPassword: (value) => validatePassword(value),
      confirmPassword: (value) => validatePresence(value, "Confirm Password"),
    },
    submitHandler,
    (formData) => {
      const errors: Partial<Record<string, string>> = {};
      if (
        formData.newPassword &&
        formData.currentPassword &&
        formData.newPassword === formData.currentPassword
      ) {
        errors.newPassword =
          "New password must be different from current password";
      }
      if (
        formData.confirmPassword &&
        formData.newPassword &&
        formData.confirmPassword !== formData.newPassword
      ) {
        errors.confirmPassword = "Passwords don't match";
      }
      return errors;
    },
    {
      debounceDelay: 300,
      triggerFields: ["currentPassword", "newPassword", "confirmPassword"],
    }
  );

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} closeModal={closeModal} title="Change Password">
      <section className="form-container">
        <form onSubmit={handleSubmit} noValidate>
          {errors.api && (
            <div className="api-error-message" role="alert" id="api-error">
              {errors.api}
            </div>
          )}
          <FormField
            label="Current password"
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            error={errors.currentPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            showPasswordToggle={true}
            required
          />
          <FormField
            label="New password"
            type="password"
            name="newPassword"
            value={formData.newPassword}
            helptext="New password must be different from your current password and must be 8 to 64 characters long"
            error={errors.newPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            showPasswordToggle={true}
            required
          />
          <FormField
            label="Confirm new password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            error={errors.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            showPasswordToggle={true}
            required
          />
          <button
            type="submit"
            className="btn w-full"
            disabled={!isFormValid()}
            aria-describedby={errors.api ? "api-error" : undefined}
          >
            Update
          </button>
        </form>
      </section>
    </Modal>
  );
}

export default UpdatePasswordlModal;
