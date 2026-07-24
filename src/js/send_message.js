
export async function send_message(recipientUser, message) {

  if (!stompClient || !stompClient.connected) {


        console.log("WebSocket not connected");


        return;


    }

  stompClient.send(


        "/app/chat.send",


        {},


        JSON.stringify({recipientUser, message})


    );
}
