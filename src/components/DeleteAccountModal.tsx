import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios";

import type { EditModalProps } from "../types";
import { useForm } from "../hooks/useForm";
import { useUser } from "../hooks/useUser";
import { validatePassword } from "../utils/validation";
import Modal from "./Modal";
import FormField from "./FormField";

function DeleteAccountModal({ isOpen, closeModal, onSuccess }: EditModalProps) {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [hasAcknowledged, setHasAcknowledged] = useState(false);

  const submitHandler = async (data: { password: string }) => {
    const response = await axios.delete("users/profile", {
      data: { password: data.password },
    });
    if (response.status === 204) {
      setUser(null);
      navigate("/", { replace: true });
      onSuccess();
    }
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
    { password: "" },
    { password: (value) => validatePassword(value) },
    submitHandler
  );

  const canSubmit = hasAcknowledged && isFormValid();

  useEffect(() => {
    if (!isOpen) {
      resetForm();
      setHasAcknowledged(false);
    }
  }, [isOpen, resetForm]);

  if (!isOpen) return null;

  return (
    <>
      <Modal isOpen={isOpen} closeModal={closeModal} title="Delete Account">
        <div className="warning-message">
          <p>
            <strong>⚠️ This action cannot be undone!</strong>
          </p>
          <p>Deleting your account will permanently remove:</p>
          <ul>
            <li>Your profile and account information</li>
            <li>All your book reviews</li>
            <li>Your reading recommendations</li>
          </ul>
        </div>

        <div className="acknowledgement-section">
          <label className="acknowledgement-checkbox">
            <input
              type="checkbox"
              checked={hasAcknowledged}
              onChange={(e) => setHasAcknowledged(e.target.checked)}
            />
            I understand that this action is permanent and cannot be undone.
          </label>
        </div>

        <form onSubmit={handleSubmit}>
          {errors.api && (
            <div className="api-error-message" role="alert" id="api-error">
              {errors.api}
            </div>
          )}
          <div
            className={`form-field-container ${
              !hasAcknowledged ? "form-field-muted" : ""
            }`}
          >
            <FormField
              label="Enter your password to confirm"
              type="password"
              name="password"
              value={formData.password}
              error={errors.password}
              onChange={handleChange}
              onBlur={handleBlur}
              showPasswordToggle={true}
              required
              disabled={!hasAcknowledged}
            />
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn-slim btn-danger ${
                !canSubmit ? "btn-danger-disabled" : ""
              }`}
              disabled={!isFormValid()}
              aria-describedby={errors.api ? "api-error" : undefined}
            >
              Delete Account
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default DeleteAccountModal;
