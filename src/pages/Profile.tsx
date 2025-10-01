import { useState } from "react";
import { useUser } from "../hooks/useUser";
import UpdateUsernameModal from "../components/UpdateUsernameModal";
import UpdateEmailModal from "../components/UpdateEmailModal";
import UpdatePasswordlModal from "../components/UpdatePasswordModal";

function Profile() {
  const { user, isLoading } = useUser();

  const [activeModal, setActiveModal] = useState<
    "username" | "email" | "password" | null
  >(null);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return null;

  if (user) {
    return (
      <div className="container">
        <h2 className="title">Profile</h2>
        <div className="profile-info">
          <p className="profile-field">
            <strong>Username:</strong> {user.username}
            <button
              className="edit-btn"
              onClick={() => setActiveModal("username")}
              aria-label="Edit username"
              title="Edit username"
              type="button"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
            </button>
          </p>
          <p className="profile-field">
            <strong>Email:</strong> {user.email}
            <button
              className="edit-btn"
              onClick={() => setActiveModal("email")}
              aria-label="Edit email"
              title="Edit email"
              type="button"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
            </button>
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
        />
        <UpdateEmailModal
          isOpen={activeModal === "email"}
          closeModal={() => setActiveModal(null)}
        />
        <UpdatePasswordlModal
          isOpen={activeModal === "password"}
          closeModal={() => setActiveModal(null)}
        />
      </div>
    );
  }

  return null;
}

export default Profile;
