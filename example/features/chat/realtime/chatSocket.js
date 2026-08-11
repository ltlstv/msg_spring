import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { WS_URL } from '../../../shared/api/config.js';

export function createChatSocket({ token, onMessage }) {
  const client = new Client({
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    webSocketFactory: () => new SockJS(WS_URL),
    onConnect: () => {
      client.subscribe('/user/queue/messages', (frame) => {
        const item = JSON.parse(frame.body).message;
        onMessage({
          sender: item.sender,
          message: item.message,
        });
      });
    },
  });

  client.activate();

  return {
    sendMessage({ recipientUser, message }) {
      client.publish({
        destination: '/app/chat.send',
        body: JSON.stringify({ recipientUser, message }),
      });
    },
    disconnect() {
      client.deactivate();
    },
  };
}
