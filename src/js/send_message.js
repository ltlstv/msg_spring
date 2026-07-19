export async function send_message(recipientUser, message) {

    if (!stompClient || !stompClient.connected) {
        console.log("WebSocket не подключен");
        return;
    }

    stompClient.send(
        "/app/chat.send",
        {},
        JSON.stringify({recipientUser, message})
    );
}
