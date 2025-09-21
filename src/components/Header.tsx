import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useUser } from "../hooks/useUser";
import axios from "../config/axios";
import { useState } from "react";
import BookSearchModal from "./BookSearchModal";

function Header() {
  const navigate = useNavigate();
  const { user, setUser, isAuthenticated } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
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
                <Link to="/login" className="nav-link" onClick={closeMenu}>
                  Sign In
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <BookSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}

export default Header;
