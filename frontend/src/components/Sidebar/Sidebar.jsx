// src/components/Sidebar/Sidebar.jsx
import React from "react";
import logo from "../../assets/logo.png";
import "./Sidebar.css";

export const Sidebar = ({ children }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="Logo" className="sidebar-logo" />
      </div>
      <div className="sidebar-content">{children}</div>
    </aside>
  );
};
