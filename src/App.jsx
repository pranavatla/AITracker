import { useState, useEffect } from 'react';
import FinalPlan from './Plan';
import {
  getLoginUrl, getLogoutUrl,
  exchangeCode, refreshSession,
  saveSession, loadSession, clearSession, isValid,
} from './auth';

const Splash = ({ msg }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100vh', background: '#0a0e1a',
    color: '#64748b', fontFamily: 'DM Sans, sans-serif', fontSize: 14,
  }}>
    {msg}
  </div>
);

export default function App() {
  const [authState, setAuthState] = useState('loading'); // 'loading' | 'auth' | 'unauth'
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const init = async () => {
      // Handle Cognito redirect with authorization code
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (code) {
        // Remove code from URL immediately — prevents issues on refresh
        window.history.replaceState({}, '', window.location.pathname);
        try {
          const tokens = await exchangeCode(code);
          saveSession(tokens);
          setAccessToken(tokens.access_token);
          setAuthState('auth');
        } catch {
          clearSession();
          setAuthState('unauth');
        }
        return;
      }

      // Check stored session
      const session = loadSession();
      if (isValid(session)) {
        setAccessToken(session.access_token);
        setAuthState('auth');
        return;
      }

      // Try silent refresh with refresh token
      if (session?.refresh_token) {
        try {
          const tokens = await refreshSession(session.refresh_token);
          saveSession({ ...tokens, refresh_token: session.refresh_token });
          setAccessToken(tokens.access_token);
          setAuthState('auth');
          return;
        } catch {
          clearSession();
        }
      }

      setAuthState('unauth');
    };

    init();
  }, []);

  const logout = () => {
    clearSession();
    window.location.href = getLogoutUrl();
  };

  if (authState === 'loading') return <Splash msg="Loading…" />;

  if (authState === 'unauth') {
    window.location.href = getLoginUrl();
    return <Splash msg="Redirecting to login…" />;
  }

  return <FinalPlan accessToken={accessToken} onLogout={logout} />;
}
