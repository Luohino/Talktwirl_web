import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';

const logoUrl = '/assets/talktwirl_logo.png'; // Place your logo in public/assets/

const Login: React.FC = () => {
  const [input, setInput] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const canLogin = agreed && input.trim() && password.trim() && !loading;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    let emailToUse = input.trim();
    try {
      if (!input.includes('@')) {
        // Lookup email by username
        const { data, error: userError } = await supabase
          .from('profiles')
          .select('email')
          .ilike('username', input.trim())
          .maybeSingle();
        if (userError || !data?.email) {
          setError('No account found for this username.');
          setLoading(false);
          return;
        }
        emailToUse = data.email;
      }
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password: password.trim(),
      });
      if (loginError || !data.user) {
        setError('Invalid credentials.');
        setLoading(false);
        return;
      }
      setLoading(false);
      navigate('/home');
    } catch (err: any) {
      setError('Login failed.');
      setLoading(false);
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
        onSubmit={handleLogin}
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
          type="text"
          placeholder="Email address or username"
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{
            width: '100%',
            padding: '14px 12px',
            borderRadius: 8,
            border: 'none',
            background: '#2a1840',
            color: '#fff',
            fontSize: 16,
            marginBottom: 4,
            outline: 'none',
            boxShadow: '0 1px 2px #0001',
          }}
        />
        <div style={{ position: 'relative', marginBottom: 4 }}>
          <input
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 12px',
              borderRadius: 8,
              border: 'none',
              background: '#2a1840',
              color: '#fff',
              fontSize: 16,
              outline: 'none',
              boxShadow: '0 1px 2px #0001',
            }}
          />
          <button
            type="button"
            onClick={() => setIsPasswordVisible(v => !v)}
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: 18,
              cursor: 'pointer',
              padding: 0,
            }}
            tabIndex={-1}
          >
            {isPasswordVisible ? '🙈' : '👁️'}
          </button>
        </div>
        {error && <div style={{ color: 'red', marginBottom: 4, fontSize: 14 }}>{error}</div>}
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 14 }}>
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} id="terms" style={{ accentColor: '#6A00FF' }} />
          <label htmlFor="terms" style={{ color: '#fff', marginLeft: 8 }}>
            I agree to the{' '}
            <span style={{ color: '#6A00FF', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => navigate('/termsAndConditions')}>Terms & Conditions</span>{' '}
            and{' '}
            <span style={{ color: '#6A00FF', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => navigate('/termsAndConditions')}>Community Guidelines</span>
          </label>
        </div>
        <button
          type="submit"
          disabled={!canLogin}
          style={{
            width: '100%',
            height: 48,
            borderRadius: 12,
            border: 'none',
            background: 'linear-gradient(90deg, #6A00FF, #D800A6)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 18,
            cursor: canLogin ? 'pointer' : 'not-allowed',
            margin: '10px 0 0 0',
            boxShadow: '0 2px 8px #6A00FF33',
            transition: 'background 0.2s, box-shadow 0.2s',
            opacity: canLogin ? 1 : 0.6,
          }}
        >
          {loading ? 'Logging in...' : 'Log in'}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0', color: '#aaa', fontSize: 14 }}>
          <div style={{ flex: 1, height: 1, background: '#444' }} />
          <span style={{ margin: '0 8px' }}>OR</span>
          <div style={{ flex: 1, height: 1, background: '#444' }} />
        </div>
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <span style={{ color: '#fff', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/forgotPassword')}>forgot password?</span>
        </div>
        <div style={{ textAlign: 'center', fontSize: 15 }}>
          <span style={{ color: '#fff' }}>Don't have an account? </span>
          <span style={{ color: '#6A00FF', fontWeight: 700, cursor: 'pointer' }} onClick={() => navigate('/signup')}>Sign up</span>
        </div>
      </form>
    </div>
  );
};

export default Login;

