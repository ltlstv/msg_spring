import { API_BASE_URL } from '../../../shared/api/config.js';

export async function getMessageHistory(token) {
  const response = await fetch(
    `${API_BASE_URL}/api/user/messages/get-message-history`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? 'Could not load messages');
  }

  return data.messages ?? [];
}
