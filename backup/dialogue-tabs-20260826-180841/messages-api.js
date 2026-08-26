import { getToken } from '../../../services/utils.js';
import { getStompClient } from '../../../services/ws-connection.js';
import { getCurrentUname } from '../../../services/utils.js';

const API_BASE = 'http://localhost:8080';

export async function getMessagesHistory() {
  const token = getToken();
  const response = await fetch(`${API_BASE}/api/user/messages/get-message-history`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
}

export async function sendMessage(recipientUser, message) {
  const stompClient = getStompClient();

  if (!stompClient?.connected) {
    console.log('WebSocket not connected');
    return;
  }

  stompClient.publish({
    destination: '/app/chat.send',
    body: JSON.stringify({ recipientUser, message }),
  });

  return {
    sender: getCurrentUname(),
    message,
  }
}