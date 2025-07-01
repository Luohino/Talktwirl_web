import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';

const NewPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }
    try {
      const { data, error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(updateError.message || 'Failed to update password.');
      } else {
        setSuccess('Password updated! Please log in with your new password.');
        setTimeout(() => navigate('/login'), 1800);
      }
    } catch (e) {
      setError('Error: ' + (e as Error).toString());
    }
    setLoading(false);
  };

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
        <div style={{ color: 'white', fontSize: 18, textAlign: 'center', marginBottom: 24 }}>
          Enter your new password below.
        </div>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={e => { setPassword(e.target.value); if (error) setError(null); }}
          style={{
            width: '100%',
            padding: '14px 16px',
            borderRadius: 16,
            border: 'none',
            background: 'rgba(255,255,255,0.08)',
            color: 'white',
            fontSize: 17,
            marginBottom: 8,
            outline: error ? '2px solid #ff4d6d' : 'none',
          }}
        />
        {error && <div style={{ color: '#ff4d6d', marginBottom: 8, width: '100%', textAlign: 'left', fontSize: 15 }}>{error}</div>}
        {success && <div style={{ color: '#00ffae', marginBottom: 8, fontSize: 16, textAlign: 'center' }}>{success}</div>}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            height: 48,
            borderRadius: 16,
            border: 'none',
            background: 'linear-gradient(90deg, #6A00FF, #D800A6)',
            color: 'white',
            fontWeight: 700,
            fontSize: 18,
            marginTop: 16,
            marginBottom: 10,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            position: 'relative',
          }}
        >
          {loading ? <span className="loader" style={{ width: 24, height: 24, border: '3px solid #fff', borderTop: '3px solid #D800A6', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} /> : 'Set New Password'}
        </button>
        <button
          onClick={() => navigate('/login')}
          style={{
            width: '100%',
            height: 40,
            borderRadius: 16,
            border: 'none',
            background: 'none',
            color: '#a259f7',
            fontWeight: 700,
            fontSize: 16,
            marginTop: 18,
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default NewPassword;
