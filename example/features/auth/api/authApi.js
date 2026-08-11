import { API_BASE_URL } from '../../../shared/api/config.js';

async function postJson(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? 'Request failed');
  }

  return data;
}

export function loginUser({ username, password }) {
  return postJson('/api/user/auth/login', { username, password });
}

export function registerUser({ username, password }) {
  return postJson('/api/user/auth/register', { username, password });
}

export async function uploadAvatar({ token, file }) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/user/profile/avatar`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? 'Could not upload avatar');
  }

  return data;
}
