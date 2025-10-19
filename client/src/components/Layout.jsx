import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-content">
          <Link to="/" className="logo">
            MERN Blog
          </Link>
          
          <div className="nav-links">
            <Link to="/" className="nav-link">
              Home
            </Link>
            
            {currentUser ? (
              <>
                <Link to="/create-post" className="nav-link">
                  Create Post
                </Link>
                <Link to={`/profile/${currentUser.id}`} className="nav-link">
                  Profile
                </Link>
                <span className="user-greeting">Hello, {currentUser.username}</span>
                <button onClick={handleLogout} className="nav-button">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="nav-button">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
