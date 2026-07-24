export function subscribeToMessages(stompClient) {

    stompClient.subscribe(

        "/user/queue/messages",

        function(message) {
            const data = JSON.parse(message.body);
        }
    );
}
