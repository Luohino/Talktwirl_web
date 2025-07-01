import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';

const logoUrl = '/assets/talktwirl_logo.png';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLinkSent, setIsLinkSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const isValidEmail = (email: string) => {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  };

  const handleSendReset = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) {
      setEmailError('Please enter your email.');
      return;
    }
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    if (!agreed) {
      setEmailError('You must agree to the terms to continue.');
      return;
    }
    setLoading(true);
    setEmailError(null);
    setSuccessMessage(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        setEmailError(error.message || 'Failed to send reset email.');
      } else {
        setIsLinkSent(true);
        setSuccessMessage(`Password reset link sent to ${email}. Please check your inbox.`);
        setTimeout(() => navigate('/login'), 5000);
      }
    } catch (e) {
      setEmailError('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  const canSend = agreed && isValidEmail(email) && !loading && !isLinkSent;

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #150121 0%, #6A00FF 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
    }}>
      <form
        onSubmit={handleSendReset}
        style={{
          background: 'rgba(30,0,50,0.95)',
          borderRadius: 24,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          padding: '40px 32px',
          maxWidth: 400,
          width: '90vw',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <img
            src={logoUrl}
            alt="Talktwirl Logo"
            style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 8, borderRadius: 16, boxShadow: '0 2px 8px #0002' }}
            onError={e => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <h1 style={{
            fontSize: 38,
            fontWeight: 800,
            letterSpacing: 1.2,
            background: 'linear-gradient(90deg, cyan, #6A00FF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
          }}>Talktwirl</h1>
        </div>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          disabled={isLinkSent}
          onChange={e => { setEmail(e.target.value); if (emailError) setEmailError(null); }}
          style={{
            width: '100%',
            padding: '14px 12px',
            borderRadius: 8,
            border: 'none',
            background: '#2a1840',
            color: '#fff',
            fontSize: 16,
            marginBottom: 4,
            outline: emailError ? '2px solid #ff4d6d' : 'none',
            boxShadow: '0 1px 2px #0001',
          }}
        />
        {emailError && <div style={{ color: '#ff4d6d', marginBottom: 4, width: '100%', textAlign: 'left', fontSize: 14 }}>{emailError}</div>}
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 14 }}>
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} id="terms" style={{ accentColor: '#6A00FF' }} disabled={isLinkSent} />
          <label htmlFor="terms" style={{ color: '#fff', marginLeft: 8 }}>
            I agree to the{' '}
            <span style={{ color: '#6A00FF', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => navigate('/termsAndConditions')}>Terms & Conditions</span>{' '}
            and{' '}
            <span style={{ color: '#6A00FF', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => navigate('/termsAndConditions')}>Community Guidelines</span>
          </label>
        </div>
        <button
          type="submit"
          disabled={!canSend}
          style={{
            width: '100%',
            height: 48,
            borderRadius: 12,
            border: 'none',
            background: 'linear-gradient(90deg, #6A00FF, #D800A6)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 18,
            cursor: canSend ? 'pointer' : 'not-allowed',
            margin: '10px 0 0 0',
            boxShadow: '0 2px 8px #6A00FF33',
            transition: 'background 0.2s, box-shadow 0.2s',
            opacity: canSend ? 1 : 0.6,
          }}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
        <div style={{ color: '#fff', fontSize: 13, marginTop: 6, opacity: 0.7, textAlign: 'center' }}>
          Reminder: You must agree to the terms to use this app.
        </div>
        {successMessage && <div style={{ color: '#00ffae', marginBottom: 10, fontSize: 16, textAlign: 'center' }}>{successMessage}</div>}
        {isLinkSent && (
          <div style={{ color: '#fff', fontSize: 14, marginTop: 18, textAlign: 'center', opacity: 0.7 }}>
            After clicking the reset link in your email, you will be redirected back to the app to set a new password.
          </div>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;


