export function subscribeToMessages(stompClient) {
  stompClient.subscribe('/user/queue/messages', (message) => {
    const data = JSON.parse(message.body);
    console.log(data);
  });
}
