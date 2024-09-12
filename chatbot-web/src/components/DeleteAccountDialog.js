import React, { useState } from "react";
import "./DeleteAccountDialog.css";

const DeleteAccountDialog = ({ onClose, onConfirm }) => {
  const [confirmationText, setConfirmationText] = useState("");
  const [error, setError] = useState("");

  const handleConfirmClick = () => {
    // onConfirm을 호출할 때 confirmationText를 인자로 전달
    if (confirmationText === "DELETE MY ACCOUNT") {
      onConfirm(confirmationText);
    } else {
      setError("확인란에 'DELETE MY ACCOUNT'를 정확히 입력해 주세요.");
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h2>정말 회원탈퇴하시겠습니까?</h2>
        <p>탈퇴하면 데이터가 모두 삭제됩니다.</p>
        <input
          type="text"
          placeholder="DELETE MY ACCOUNT"
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
        />
        {error && <p className="error-message">{error}</p>}
        <button onClick={handleConfirmClick}>확인</button>
        <button onClick={onClose}>취소</button>
      </div>
    </div>
  );
};


export default DeleteAccountDialog;
