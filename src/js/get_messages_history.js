import { getToken } from './auth_api';

async function get_messages_history() {
  const token = getToken();

  const response = await fetch('http://localhost:8080/api/messages/get-message-history', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
}

export async function renderMessages() {
  const data = await get_messages_history();
  const messages = data.messages;

  const container = document.getElementById('message-container');
  container.innerHTML = '';

  if (!messages) {
    alert(data.message || data.value || 'Could not load messages');
    return;
  }

  messages.forEach((msg) => renderSingleMessage(msg,container))
}

export async function renderSingleMessage(msg,container) {

  const messageDiv = document.createElement('div');

  messageDiv.classList.add('message');
  messageDiv.innerHTML = `
            <h3>${msg.sender}</h3>
            <p>${msg.message}</p>
        `;
  container.appendChild(messageDiv);

}