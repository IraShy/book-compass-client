import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div className="container">
      <h1 className="title">Page Not Found</h1>
      <Link to="/" className="btn">
        Home
      </Link>
    </div>
  );
}

export default PageNotFound;
