import { subscribeToMessages } from './subscriptions.js';
import { getToken } from './auth_api.js'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'

let stompClient;

export function connect_ws() {

    const socket = new SockJS(
        "http://localhost:8080/websocket"
    );

    stompClient = StompJs.Stomp.over(socket);
    const token = getToken();

    stompClient.activate(
        {
            Authorization:
                "Bearer " + token
        },

        function () {
            subscribeToMessages(stompClient);
        }
    )
}