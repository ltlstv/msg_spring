import { getMessagesHistory } from './get-messages.js';

export async function renderMultipleMessages() {
  const data = await getMessagesHistory();
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
