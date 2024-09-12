import React from "react";
import "./LogoutDialog.css";

const LogoutDialog = ({ onClose, onLogout }) => {
  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>로그아웃 하시겠습니까?</h2>
        <button className="logout-button" onClick={onLogout}>
          로그아웃하기
        </button>
      </div>
    </div>
  );
};

export default LogoutDialog;
