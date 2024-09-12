import './UnderLineTabs.css';
import React from 'react';

const UnderLineTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <nav className="linetabs-container">
      {tabs.map((tab) => (
        <a
          key={tab}
          className={`tab-button ${activeTab === tab ? 'active' : ''}`}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </a>
      ))}
    </nav>
  );
};

export default UnderLineTabs;
