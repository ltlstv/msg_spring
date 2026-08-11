import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { subscribeToMessages } from '../features/chat/services/subscriptions.js';
import { getToken } from './utils.js';

let stompClient;

export function connect_ws(onMessage) {
  const token = getToken();

  stompClient = new Client({
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    webSocketFactory: () => new SockJS('http://localhost:8080/websocket'),
    onConnect: () => {
      subscribeToMessages(stompClient, onMessage);
    },
  });

  stompClient.activate();
}

export function getStompClient() {
  return stompClient;
}
