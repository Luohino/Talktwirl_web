import React from 'react';

interface BottomNavBarProps {
  activeTab: 'home' | 'add' | 'profile';
  onTabChange?: (tab: 'home' | 'add' | 'profile') => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div
      style={{
        position: 'fixed',
        right: 0,
        bottom: 0,
        zIndex: 100,
        background: 'rgba(24, 18, 43, 0.98)',
        borderRadius: 30,
        margin: 12,
        padding: '10px 0',
        display: 'flex',
        justifyContent: 'space-evenly',
        boxShadow: '0 4px 24px #0003',
        maxWidth: 500,
        width: 'calc(100vw - 24px)',
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      <button
        onClick={() => onTabChange && onTabChange('home')}
        style={{
          background: 'none',
          border: 'none',
          color: activeTab === 'home' ? '#FF6F91' : '#fff',
          fontSize: 28,
          borderRadius: 16,
          padding: '0 24px',
          cursor: 'pointer',
        }}
        aria-label="Home"
      >
        <span role="img" aria-label="Home">🏠</span>
      </button>
      <button
        onClick={() => onTabChange && onTabChange('add')}
        style={{
          background: 'none',
          border: 'none',
          color: activeTab === 'add' ? '#FF6F91' : '#fff',
          fontSize: 28,
          borderRadius: 16,
          padding: '0 24px',
          cursor: 'pointer',
        }}
        aria-label="Add"
      >
        <span role="img" aria-label="Add">➕</span>
      </button>
      <button
        onClick={() => onTabChange && onTabChange('profile')}
        style={{
          background: 'none',
          border: 'none',
          color: activeTab === 'profile' ? '#FF6F91' : '#fff',
          fontSize: 28,
          borderRadius: 16,
          padding: '0 24px',
          cursor: 'pointer',
        }}
        aria-label="Profile"
      >
        <span role="img" aria-label="Profile">👤</span>
      </button>
    </div>
  );
};

export default BottomNavBar; 