import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';

const logoUrl = '/assets/talktwirl_logo.png'; // Place your logo in public/assets/

const Signup: React.FC = () => {
  const [step, setStep] = useState(0); // 0: email, 1: otp, 2: password, 3: username
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [authValue, setAuthValue] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inputError, setInputError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const navigate = useNavigate();

  const isValidEmail = (email: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

  const sendOtp = async () => {
    setInputError('');
    setIsLoading(true);
    if (!email.trim()) {
      setInputError('Enter email address.');
      setIsLoading(false);
      return;
    }
    if (!isValidEmail(email.trim())) {
      setInputError('Invalid email address.');
      setIsLoading(false);
      return;
    }
    try {
      await supabase.auth.signInWithOtp({ email: email.trim(), options: { shouldCreateUser: true } });
      setAuthValue(email.trim());
      setStep(1);
      setIsLoading(false);
      alert('OTP sent to your email.');
    } catch (e: any) {
      setInputError('Failed to send OTP: ' + (e.message || e.toString()));
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    setOtpError('');
    setIsLoading(true);
    if (!otp.trim()) {
      setOtpError('Enter the OTP code.');
      setIsLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: authValue,
        token: otp.trim(),
        type: 'email',
      });
      if (error || !data.session || !data.user) {
        setOtpError('Invalid OTP code.');
        setIsLoading(false);
        return;
      }
      setAccessToken(data.session.access_token);
      setStep(2);
      setIsLoading(false);
    } catch (e: any) {
      setOtpError('Failed to verify OTP: ' + (e.message || e.toString()));
      setIsLoading(false);
    }
  };

  const setPasswordStep = async () => {
    setPasswordError('');
    setIsLoading(true);
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      setIsLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase.auth.updateUser({ password });
      if (error || !data.user) {
        setPasswordError('Failed to set password.');
        setIsLoading(false);
        return;
      }
      setStep(3);
      setIsLoading(false);
    } catch (e: any) {
      setPasswordError('Failed to set password: ' + (e.message || e.toString()));
      setIsLoading(false);
    }
  };

  const setUsernameAndFinish = async () => {
    setUsernameError('');
    setIsLoading(true);
    if (!username.trim() || username.trim().length < 3) {
      setUsernameError('Username must be at least 3 characters.');
      setIsLoading(false);
      return;
    }
    try {
      const user = supabase.auth.user();
      if (!user) {
        setUsernameError('User not found.');
        setIsLoading(false);
        return;
      }
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        username: username.trim(),
        email: user.email,
        created_at: new Date().toISOString(),
      });
      if (error) {
        setUsernameError('Failed to save profile: ' + (error.message || 'Unknown error'));
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      navigate('/home');
    } catch (e: any) {
      setUsernameError('Failed to save profile: ' + (e.message || e.toString()));
      setIsLoading(false);
    }
  };

  // UI for each step
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '14px 12px', borderRadius: 8, border: 'none', marginBottom: 4, background: '#2a1840', color: '#fff', fontSize: 16, outline: 'none', boxShadow: '0 1px 2px #0001' }}
              onKeyDown={e => e.key === 'Enter' && sendOtp()}
            />
            {inputError && <div style={{ color: 'red', marginBottom: 8 }}>{inputError}</div>}
            <button
              type="button"
              disabled={isLoading}
              onClick={sendOtp}
              style={{ width: '100%', height: 48, borderRadius: 12, border: 'none', background: 'linear-gradient(90deg, #6A00FF, #D800A6)', color: '#fff', fontWeight: 700, fontSize: 18, cursor: isLoading ? 'not-allowed' : 'pointer', marginBottom: 8, boxShadow: isLoading ? 'none' : '0 2px 8px #6A00FF33', transition: 'background 0.2s, box-shadow 0.2s' }}
            >
              {isLoading ? 'Sending...' : 'Next'}
            </button>
          </>
        );
      case 1:
        return (
          <>
            <input
              type="text"
              placeholder="Enter OTP code"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              style={{ width: '100%', padding: '14px 12px', borderRadius: 8, border: 'none', marginBottom: 4, background: '#2a1840', color: '#fff', fontSize: 16, outline: 'none', boxShadow: '0 1px 2px #0001' }}
              onKeyDown={e => e.key === 'Enter' && verifyOtp()}
            />
            {otpError && <div style={{ color: 'red', marginBottom: 8 }}>{otpError}</div>}
            <button
              type="button"
              disabled={isLoading}
              onClick={verifyOtp}
              style={{ width: '100%', height: 48, borderRadius: 12, border: 'none', background: 'linear-gradient(90deg, #6A00FF, #D800A6)', color: '#fff', fontWeight: 700, fontSize: 18, cursor: isLoading ? 'not-allowed' : 'pointer', marginBottom: 8, boxShadow: isLoading ? 'none' : '0 2px 8px #6A00FF33', transition: 'background 0.2s, box-shadow 0.2s' }}
            >
              {isLoading ? 'Verifying...' : 'Next'}
            </button>
          </>
        );
      case 2:
        return (
          <>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '14px 12px', borderRadius: 8, border: 'none', marginBottom: 4, background: '#2a1840', color: '#fff', fontSize: 16, outline: 'none', boxShadow: '0 1px 2px #0001' }}
              onKeyDown={e => e.key === 'Enter' && setPasswordStep()}
            />
            {passwordError && <div style={{ color: 'red', marginBottom: 8 }}>{passwordError}</div>}
            <button
              type="button"
              disabled={isLoading}
              onClick={setPasswordStep}
              style={{ width: '100%', height: 48, borderRadius: 12, border: 'none', background: 'linear-gradient(90deg, #6A00FF, #D800A6)', color: '#fff', fontWeight: 700, fontSize: 18, cursor: isLoading ? 'not-allowed' : 'pointer', marginBottom: 8, boxShadow: isLoading ? 'none' : '0 2px 8px #6A00FF33', transition: 'background 0.2s, box-shadow 0.2s' }}
            >
              {isLoading ? 'Saving...' : 'Next'}
            </button>
          </>
        );
      case 3:
        return (
          <>
            <input
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{ width: '100%', padding: '14px 12px', borderRadius: 8, border: 'none', marginBottom: 4, background: '#2a1840', color: '#fff', fontSize: 16, outline: 'none', boxShadow: '0 1px 2px #0001' }}
              onKeyDown={e => e.key === 'Enter' && setUsernameAndFinish()}
            />
            {usernameError && <div style={{ color: 'red', marginBottom: 8 }}>{usernameError}</div>}
            <button
              type="button"
              disabled={isLoading}
              onClick={setUsernameAndFinish}
              style={{ width: '100%', height: 48, borderRadius: 12, border: 'none', background: 'linear-gradient(90deg, #6A00FF, #D800A6)', color: '#fff', fontWeight: 700, fontSize: 18, cursor: isLoading ? 'not-allowed' : 'pointer', marginBottom: 8, boxShadow: isLoading ? 'none' : '0 2px 8px #6A00FF33', transition: 'background 0.2s, box-shadow 0.2s' }}
            >
              {isLoading ? 'Finishing...' : 'Sign up'}
            </button>
          </>
        );
      default:
        return null;
    }
  };

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
        onSubmit={e => e.preventDefault()}
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
        {renderStep()}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <span style={{ color: '#fff' }}>Already have an account? </span>
          <span style={{ color: '#6A00FF', fontWeight: 700, cursor: 'pointer' }} onClick={() => navigate('/login')}>Log in</span>
        </div>
      </form>
    </div>
  );
};

export default Signup;
