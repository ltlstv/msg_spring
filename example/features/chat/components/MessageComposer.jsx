import { useState } from 'react';

export function MessageComposer({ disabled, onSend }) {
  const [recipientUser, setRecipientUser] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    onSend({ recipientUser, message });
    setMessage('');
  }

  return (
    <form className="composer" onSubmit={handleSubmit}>
      <input
        aria-label="Recipient"
        disabled={disabled}
        placeholder="Recipient"
        value={recipientUser}
        onChange={(event) => setRecipientUser(event.target.value)}
      />
      <input
        aria-label="Message"
        disabled={disabled}
        placeholder="Message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
      <button type="submit" disabled={disabled || !message.trim()}>
        Send
      </button>
    </form>
  );
}
