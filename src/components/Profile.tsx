function Profile() {
  return (
    <div className="container">
      <h2 className="title">Profile</h2>
      <p>Hello user</p>

      <button className="btn" onClick={() => console.log("Logout clicked")}>
        Logout
      </button>
    </div>
  );
}

export default Profile;
