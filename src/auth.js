const DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN;
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_COGNITO_REDIRECT_URI || window.location.origin;
const SESSION_KEY = 'aitracker_session';

export const getLoginUrl = () => {
  const p = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    scope: 'openid email profile',
    redirect_uri: REDIRECT_URI,
  });
  return `https://${DOMAIN}/login?${p}`;
};

export const getLogoutUrl = () => {
  const p = new URLSearchParams({
    client_id: CLIENT_ID,
    logout_uri: REDIRECT_URI,
  });
  return `https://${DOMAIN}/logout?${p}`;
};

export const exchangeCode = async (code) => {
  const res = await fetch(`https://${DOMAIN}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });
  if (!res.ok) throw new Error('Token exchange failed');
  return res.json();
};

export const refreshSession = async (refreshToken) => {
  const res = await fetch(`https://${DOMAIN}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: CLIENT_ID,
      refresh_token: refreshToken,
    }),
  });
  if (!res.ok) throw new Error('Refresh failed');
  return res.json();
};

export const saveSession = (tokens) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token || null,
    expires_at: Date.now() + (tokens.expires_in || 3600) * 1000,
  }));
};

export const loadSession = () => {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
  catch { return null; }
};

export const clearSession = () => localStorage.removeItem(SESSION_KEY);

export const isValid = (session) =>
  !!session?.access_token && Date.now() < session.expires_at - 60_000;
