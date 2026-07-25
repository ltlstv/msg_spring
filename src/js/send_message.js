import { renderSingleMessage } from './get_messages_history.js';
import { getStompClient } from './ws_connection.js';
import { getCurrentUname } from './utils.js';

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

  const msg = {sender: getCurrentUname(), message: message}
  const container = document.getElementById('message-container');

  renderSingleMessage(msg, container)
}
