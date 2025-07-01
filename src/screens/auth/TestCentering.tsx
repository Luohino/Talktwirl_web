import React from 'react';

const TestCentering: React.FC = () => (
  <div style={{
    minHeight: '100vh',
    width: '100vw',
    background: 'linear-gradient(135deg, #150121 0%, #6A00FF 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  }}>
    <div style={{
      background: 'rgba(30,0,50,0.95)',
      borderRadius: 24,
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      padding: '40px 32px',
      maxWidth: 400,
      width: '90vw',
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
    }}>
      <h1 style={{
        fontSize: 38,
        fontWeight: 800,
        letterSpacing: 1.2,
        background: 'linear-gradient(90deg, cyan, #6A00FF)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        margin: 0,
        textAlign: 'center',
      }}>Talktwirl</h1>
      <input placeholder="Test input" style={{ width: '100%', padding: '14px 12px', borderRadius: 8, border: 'none', background: '#2a1840', color: '#fff', fontSize: 16, outline: 'none', boxShadow: '0 1px 2px #0001' }} />
    </div>
  </div>
);

export default TestCentering; 