import { useState } from "react";
import { useUser } from "../hooks/useUser";
import UpdateUsernameModal from "../components/UpdateUsernameModal";
import UpdateEmailModal from "../components/UpdateEmailModal";
import UpdatePasswordlModal from "../components/UpdatePasswordModal";
import EditButton from "../components/EditButton";

function Profile() {
  const { user, isLoading } = useUser();

  const [activeModal, setActiveModal] = useState<
    "username" | "email" | "password" | null
  >(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSuccess = () => {
    const currentModal = activeModal;
    setActiveModal(null);
    if (currentModal) {
      setSuccessMessage(`${currentModal} updated successfully`);
      setTimeout(() => setSuccessMessage(null), 6000);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="container">
      <h2 className="title">Profile</h2>
      {successMessage && (
        <div className="success-banner" role="status" aria-live="polite">
          <span>{successMessage}</span>
          <button
            className="close-btn"
            onClick={() => setSuccessMessage(null)}
            aria-label="Close success message"
          >
            ×
          </button>
        </div>
      )}

      <div className="profile-info">
        <p className="profile-field">
          <strong>Username:</strong> {user.username}
          <EditButton
            onClick={() => setActiveModal("username")}
            target="username"
          />
        </p>
        <p className="profile-field">
          <strong>Email:</strong> {user.email}
          <EditButton onClick={() => setActiveModal("email")} target="email" />
        </p>
        <p>
          <strong>Member since:</strong>{" "}
          {new Date(user.created_at).toLocaleDateString()}
        </p>

        <div className="profile-actions">
          <button
            className="btn-slim"
            onClick={() => setActiveModal("password")}
          >
            Change Password
          </button>
          {/* TODO */}
          <button className="btn-slim btn-danger">Delete Account</button>
        </div>
      </div>

      <UpdateUsernameModal
        isOpen={activeModal === "username"}
        closeModal={() => setActiveModal(null)}
        onSuccess={() => handleSuccess()}
      />
      <UpdateEmailModal
        isOpen={activeModal === "email"}
        closeModal={() => setActiveModal(null)}
        onSuccess={() => handleSuccess()}
      />
      <UpdatePasswordlModal
        isOpen={activeModal === "password"}
        closeModal={() => setActiveModal(null)}
        onSuccess={() => handleSuccess()}
      />
    </div>
  );
}

export default Profile;
