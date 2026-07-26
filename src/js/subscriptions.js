import { renderSingleMessage } from './get_messages_history.js';

export function subscribeToMessages(stompClient) {
  stompClient.subscribe('/user/queue/messages', (message) => {
    const item = JSON.parse(message.body).message;

    const container = document.getElementById('message-container');
    if (!container) return;

    renderSingleMessage({ sender: item.sender, message: item.message }, container);
  });
}
