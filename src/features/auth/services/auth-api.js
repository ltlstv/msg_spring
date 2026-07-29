import { getToken } from '../../../services/utils.js';

const API_BASE = 'http://localhost:8080';

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

export async function postUserPfpId(username) {
  const response = await fetch(
    'http://localhost:8080/api/user/profile/avatar',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    },
  );

  return response.json();
}

export async function uploadUserPfpImg(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(
    'http://localhost:8080/api/user/profile/avatar',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    },
  );

  return response.json();
}
