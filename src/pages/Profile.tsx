import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

import axios from "../config/axios";

function Profile() {
  const navigate = useNavigate();
  const { user, setUser, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return null;

  const handleLogout = async () => {
    try {
      await axios.post("users/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      navigate("/");
    }
  };

  if (user) {
    return (
      <div className="container">
        <h2 className="title">Profile</h2>

        <div className="profile-info">
          <h3>User Information</h3>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Member since:</strong>{" "}
            {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="profile-actions">
          {/* TODO */}
          <button className="btn" disabled>
            Edit Profile
          </button>
          {/* TODO */}
          <button className="btn" disabled>
            Delete Account
          </button>
          <button className="btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default Profile;
