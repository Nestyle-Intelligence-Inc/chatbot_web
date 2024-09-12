import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './DialogMenu.css';
import LogoutDialog from "./LogoutDialog";
import axiosInstance from '../components/axiosInstance';
import { useToast } from '../components/ToastContext';

function DialogMenu({ isLoggedIn }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const location = useLocation(); 
  const showToast = useToast();
  const navigate = useNavigate();

  const openDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const openLogoutDialog = () => {
    setIsLogoutDialogOpen(true);
  };

  const closeLogoutDialog = () => {
    setIsLogoutDialogOpen(false);
  };

  const handleLogout = () => {
    axiosInstance.post('/users/logout')
    .then((res) => {
      showToast('로그아웃이 완료되었습니다.', 'success');
      console.log(res);
      sessionStorage.clear();
      localStorage.clear();
      closeLogoutDialog();
      navigate('/');
    })
    .catch((err) => {
      console.log(err);
    });
  };

  return (
    <div>
      <button className='hamburger-button' onClick={openDialog}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" x2="20" y1="8" y2="8" className="origin-top-left transition-transform duration-300"></line>
          <line x1="4" x2="20" y1="16" y2="16" className="origin-bottom-left transition-transform duration-300 ease-in-out"></line>
        </svg>
      </button>

      {isDialogOpen && (
        <div className="dialog">
          {location.pathname === "/" ? (
            <>
              <Link className="dialog-link" to="#about">
                About
              </Link>
              <Link className="dialog-link" to="#price">
                Price
              </Link>
              <Link className="dialog-link" to="#reference">
                Resources
              </Link>
              {isLoggedIn ? (
                <Link className="dialog-link" to="/dash">
                  MyPage &rarr;
                </Link>
              ) : (
                <Link className="dialog-link" to="/login">
                  Sign In &rarr;
                </Link>
              )}
            </>
          ) : (
            <>
              <a className="dialog-mylink" href="/dash">
                Dashboard
              </a>
              <a className="dialog-mylink" href="/settings">
                Settings
              </a>
              <a className="dialog-mylink" type="button" onClick={openLogoutDialog}>
                Sign out
              </a>
              <a className="dialog-mylink" href="/help">
                Help
              </a>
            </>
          )}
           {isLogoutDialogOpen && (
        <LogoutDialog onClose={closeLogoutDialog} onLogout={handleLogout} />
      )}
        </div>
      )}
    </div>
  );
}

export default DialogMenu;
