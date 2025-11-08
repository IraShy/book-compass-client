import { useEffect } from "react";
import axios from "../config/axios";
import { useForm } from "../hooks/useForm";
import { useUser } from "../hooks/useUser";

import type { EditModalProps, User } from "../types";
import { validatePresence } from "../utils/validation";
import Modal from "./Modal";
import FormField from "./FormField";
function UpdateUsernameModal({
  isOpen,
  closeModal,
  onSuccess,
}: EditModalProps) {
  const { user, setUser } = useUser();

  const submitHandler = async (data: { username: string }) => {
    const response = await axios.put("users/profile", {
      username: data.username,
    });
    setUser(response.data.user);
    if (response.status === 200) onSuccess();
  };

  const {
    formData,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    isFormValid,
  } = useForm<Pick<User, "username"> & { [key: string]: string }>(
    { username: "" },
    {
      username: (value) => validatePresence(value, "Username"),
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
    <Modal isOpen={isOpen} closeModal={closeModal} title="Update Username">
      <section className="form-container">
        <form onSubmit={handleSubmit} noValidate>
          {errors.api && (
            <div className="api-error-message" role="alert" id="api-error">
              {errors.api}
            </div>
          )}

          <FormField
            label="New Username"
            type="text"
            name="username"
            value={formData.username}
            placeholder={user?.username}
            error={errors.username}
            onChange={handleChange}
            onBlur={handleBlur}
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

export default UpdateUsernameModal;
