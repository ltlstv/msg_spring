import { getToken } from '../../../services/utils.js';

export async function getMessagesHistory() {
  const token = getToken();
  const response = await fetch('http://localhost:8080/api/user/messages/get-message-history', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
}
