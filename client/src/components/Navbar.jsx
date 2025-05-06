import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">
            <span className="logo-icon">🏥</span>
            <span>Acme Health</span>
          </Link>
        </div>

        <div className="navbar-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <i className="fas fa-home"></i> Dashboard
          </Link>
          <Link
            to="/weight"
            className={`nav-link ${location.pathname === '/weight' ? 'active' : ''}`}
          >
            <i className="fas fa-weight"></i> Progress
          </Link>
          <Link
            to="/shipments"
            className={`nav-link ${location.pathname === '/shipments' ? 'active' : ''}`}
          >
            <i className="fas fa-pills"></i> Medications
          </Link>
        </div>

        <div className="navbar-user">
          <div className="user-greeting">
            <i className="fas fa-user-circle"></i>
            <span>Hi, {user?.name.split(' ')[0] ||"Guest"}</span>
          </div>
          <button onClick={handleLogout} className="logout-button">
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;