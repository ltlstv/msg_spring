import { getStompClient } from '../../../services/ws-connection.js';
import { getCurrentUname } from '../../../services/utils.js';

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

