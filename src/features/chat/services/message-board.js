import { getToken } from '../../../services/utils.js';
import { sendMessage } from './send-message';

export function initMessageBoard() {
  const testButton = document.getElementById('test-button');

  if (!testButton) {
    return () => {};
  }

  testButton.addEventListener('click', handleSendMessage);

  return () => {
    testButton.removeEventListener('click', handleSendMessage);
  };
}

async function handleSendMessage() {
  const message = document.getElementById('xtext-i').value.trim();
  const recipientUser = document.getElementById('runame-i').value.trim();

  if (!message || !getToken()) return false;

  await sendMessage(recipientUser, message);

  document.getElementById('xtext-i').value = '';
}
