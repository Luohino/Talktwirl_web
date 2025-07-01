import React from 'react';
import { useNavigate } from 'react-router-dom';

const Continue: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #150121 0%, #261531 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: 'rgba(30, 18, 48, 0.95)',
        borderRadius: 24,
        boxShadow: '0 4px 32px 0 rgba(0,0,0,0.18)',
        padding: 36,
        width: 370,
        maxWidth: '95vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h1 style={{
          fontSize: 44,
          fontWeight: 700,
          letterSpacing: 1.2,
          background: 'linear-gradient(90deg, cyan, purple)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 32,
        }}>Talktwirl</h1>
        <div style={{ color: 'white', fontSize: 18, textAlign: 'center', marginBottom: 32 }}>
          A password reset link has been sent to your email.<br />Please check your inbox and follow the instructions to reset your password.
        </div>
        <button
          onClick={() => navigate('/login')}
          style={{
            width: '100%',
            height: 48,
            borderRadius: 16,
            border: 'none',
            background: 'linear-gradient(90deg, #6A00FF, #D800A6)',
            color: 'white',
            fontWeight: 700,
            fontSize: 18,
            cursor: 'pointer',
          }}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default Continue;
