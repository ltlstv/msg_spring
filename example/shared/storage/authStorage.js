const TOKEN_KEY = 'jwt';
const USERNAME_KEY = 'uname';

export function getStoredAuth() {
  const token = localStorage.getItem(TOKEN_KEY);
  const username = localStorage.getItem(USERNAME_KEY);

  return {
    token,
    user: username ? { username } : null,
  };
}

export function saveAuth({ token, username }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USERNAME_KEY, username);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
}
