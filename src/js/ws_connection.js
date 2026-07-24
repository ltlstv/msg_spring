import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getToken } from './auth_api.js';
import { subscribeToMessages } from './subscriptions.js';

let stompClient;

export function connect_ws() {
  const token = getToken();

  stompClient = new Client({
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    webSocketFactory: () => new SockJS('http://localhost:8080/websocket'),
    onConnect: () => {
      subscribeToMessages(stompClient);
    },
  });

  stompClient.activate();
}

export function getStompClient() {
  return stompClient;
}
