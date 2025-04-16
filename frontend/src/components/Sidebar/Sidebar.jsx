// src/components/Sidebar/Sidebar.jsx
import React from "react";
import logo from "../../assets/logo.png";
import "./Sidebar.css";

export const Sidebar = ({ children, isOpen, onClose }) => {
  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <img src={logo} alt="Logo" className="sidebar-logo" />
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="sidebar-content">{children}</div>
      <footer className="sidebar-footer">
        <span className="footer-icon">©</span>
        <span>Nogueira Technologies {new Date().getFullYear()}</span>
      </footer>
    </aside>
  );
};
