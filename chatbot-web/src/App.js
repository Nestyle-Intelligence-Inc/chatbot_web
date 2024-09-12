// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainScreen from './pages/MainScreen';
import ManageScreen from './pages/ManageScreen';
import Create1Screen from './pages/Create1Screen';
import Create2Screen from './pages/Create2Screen';
import LoginScreen from './pages/LoginScreen';
import DashboardScreen from './pages/DashboardScreen';
import "./App.css";
import { ToastProvider } from './components/ToastContext';

function App() {
  return (
    <ToastProvider>
    <Router>
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/manage/:chatbotId/*" element={<ManageScreen />} />
        <Route path="/create/1" element={<Create1Screen />} />
        <Route path="/create/2" element={<Create2Screen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/dashboard/*" element={<DashboardScreen />} />
      </Routes>
    </Router>
    </ToastProvider>
  );
}

export default App;
