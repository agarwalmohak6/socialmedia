import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <div className="navbar">
      <div className="title">
        <a href="/">
          <img
            src="https://seeklogo.com/images/I/instagram-logo-A807AD378B-seeklogo.com.png"
            alt="logo"
            className="logo"
          />
        </a>
      </div>
      <div className="nav-list">
        <ul>
          <NavLink to="/about" className="nav-link">
            <li>About</li>
          </NavLink>
          <NavLink to="/contact" className="nav-link">
            <li>Contact</li>
          </NavLink>
          <NavLink to="/register" className="nav-link">
            <li>Register</li>
          </NavLink>
          <NavLink to="/login" className="nav-link">
            <li>Login</li>
          </NavLink>
        </ul>
      </div>
    </div>
  );
};

export default Header;
