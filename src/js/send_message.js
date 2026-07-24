<<<<<<< HEAD

export async function send_message(recipientUser, message) {

  if (!stompClient || !stompClient.connected) {


        console.log("WebSocket not connected");


        return;


    }

  stompClient.send(


        "/app/chat.send",


        {},


        JSON.stringify({recipientUser, message})


=======
export async function send_message(recipientUser, message) {

    if (!stompClient || !stompClient.connected) {
        console.log("WebSocket не подключен");
        return;
    }

    stompClient.send(
        "/app/chat.send",
        {},
        JSON.stringify({recipientUser, message})
>>>>>>> eb3ae1ff6641f2088b72b56d06694ddd0530fe6b
    );
}
