import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import axios from "../config/axios";
import { useUser } from "../hooks/useUser";
import BookSearchModal from "./BookSearchModal";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const { user, setUser, isAuthenticated } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const getRedirectPath = (currentPath: string) => {
    // Don't redirect back to auth pages
    const authPages = ["/login", "/signup"];
    return authPages.includes(currentPath) ? "/profile" : currentPath;
  };
  const redirectPath = getRedirectPath(currentPath);

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

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <Link to="/" className="logo">
            <h1>Book Compass</h1>
          </Link>

          <button
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${isMenuOpen ? "open" : ""}`}></span>
          </button>

          <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="nav-link" onClick={closeMenu}>
                  {user?.username}
                </Link>

                <button
                  className="nav-button"
                  onClick={() => setIsSearchOpen(true)}
                >
                  Book Search
                </button>

                <Link to="/" className="nav-link" onClick={closeMenu}>
                  My recommendations
                </Link>

                <button
                  className="nav-button"
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="nav-button"
                  onClick={() => setIsSearchOpen(true)}
                >
                  Book Search
                </button>
                <Link
                  to={`/login?redirect=${redirectPath}`}
                  className="nav-link"
                  onClick={closeMenu}
                >
                  Sign In
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <BookSearchModal
        isOpen={isSearchOpen}
        closeModal={() => setIsSearchOpen(false)}
        title="Book Search"
      />
    </>
  );
}

export default Header;
