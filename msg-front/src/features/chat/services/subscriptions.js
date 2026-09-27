export function subscribeToMessages(stompClient, onMessage) {
  return stompClient.subscribe('/user/queue/messages', (message) => {
    const item = JSON.parse(message.body).message;

    onMessage({
      sender: item.sender,
      message: item.message,
    })  
  });
}
