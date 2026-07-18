import { getToken } from './auth_api';

export async function send_message(recipientUser, message) {
  const token = getToken();

  const response = await fetch('http://localhost:8080/api/messages/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ recipientUser, message }),
  });

  return await response.json();
}
