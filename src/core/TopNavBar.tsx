import React from 'react';

const TopNavBar: React.FC = () => (
  <div style={{
    width: '100%',
    background: '#3a2352',
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    height: 64,
    boxSizing: 'border-box',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 200,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <img src="https://i.ibb.co/FrfmDtq/Picsart-25-06-29-18-49-25-732.png" alt="Logo" style={{ height: 36 }} />
      <span style={{ color: '#6A00FF', fontWeight: 800, fontSize: 28, letterSpacing: 1.1 }}>TalkTwirl</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
      <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer' }} aria-label="Play">
        <span role="img" aria-label="Play">▶️</span>
      </button>
      <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer' }} aria-label="Notifications">
        <span role="img" aria-label="Notifications">🔔</span>
      </button>
      <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer' }} aria-label="Messages">
        <span role="img" aria-label="Messages">💬</span>
      </button>
    </div>
  </div>
);

export default TopNavBar; 