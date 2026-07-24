export function subscribeToMessages(stompClient) {

    stompClient.subscribe(
<<<<<<< HEAD

        "/user/queue/messages",

        function(message) {
            const data = JSON.parse(message.body);
        }
    );
}
=======
        "/user/queue/messages",

        function(message) {

            const data = JSON.parse(message.body);

        }
    );

}
>>>>>>> eb3ae1ff6641f2088b72b56d06694ddd0530fe6b
