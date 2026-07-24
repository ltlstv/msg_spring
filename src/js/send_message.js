import { getStompClient } from './ws_connection.js';

export async function send_message(recipientUser, message) {
  const stompClient = getStompClient();

  if (!stompClient?.connected) {
    console.log('WebSocket not connected');
    return;
  }

  stompClient.publish({
    destination: '/app/chat.send',
    body: JSON.stringify({ recipientUser, message }),
  });
}
