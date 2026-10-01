import { uploadUserPfp } from '../../../services/utils.js';

const API_BASE = process.env.API_BASE_URL;

export async function register(username, password) {
  const response = await fetch(`${API_BASE}/api/user/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  return await response.json();
}

export async function login(username, password) {
  const response = await fetch(`${API_BASE}/api/user/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  return await response.json();
}


export function logout() {
  localStorage.removeItem('jwt');
}

export async function uploadUserPfpImg(file) {
  return { avatarUrl: await uploadUserPfp(file) };
}
