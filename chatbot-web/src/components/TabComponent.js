import './TabComponent.css';
import React, { useState } from 'react';

const TabComponent = ({ tabs, onTabChange }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.name || '');

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    onTabChange(tabName);
  };

  return (
    <div className="tab-container">
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={`tab ${activeTab === tab.name ? 'active' : ''}`}
          onClick={() => handleTabClick(tab.name)}
        >
          <div className="tab-inner">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
              className={`h-5 w-5 shrink-0 ${activeTab === tab.name ? 'text-zinc-900' : 'text-zinc-600'}`}
            >
              <path d={tab.iconPath} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {tab.name}
          </div>
        </button>
      ))}
    </div>
  );
};

export default TabComponent;

