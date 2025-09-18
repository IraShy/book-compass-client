import { useNavigate } from "react-router-dom";
import axios from "../config/axios";

function Profile() {
  const navigate = useNavigate();
  const handleClick = async (e: React.MouseEvent) => {
    console.log("in handleClick");
    const response = await axios.post("users/logout");
    console.log("post request sent");
    console.log(response);
    navigate("/");
  };
  return (
    <div className="container">
      <h2 className="title">Profile</h2>
      <p>Hello user</p>

      <button className="btn" onClick={handleClick}>
        Logout
      </button>
    </div>
  );
}

export default Profile;
