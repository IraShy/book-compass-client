import { useUser } from "../hooks/useUser";

function Profile() {
  const { user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return null;

  if (user) {
    return (
      <div className="container">
        <h2 className="title">Profile</h2>

        <div className="profile-info">
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
        </div>
      </div>
    );
  }

  return null;
}

export default Profile;
