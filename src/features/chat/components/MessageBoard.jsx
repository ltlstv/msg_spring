import { useRef } from 'react';
import { sendMessage } from '../services/messages-api';
import './MessageBoard.css';

export function Message({ sender, message }) {
  return (
    <article className="message">
      <h3>{sender}</h3>
      <p>{message}</p>
    </article>
  );
}

export function MessageList({ messages }) {
  return (
    <div id="message-container" className="message-container">
      {messages.map((message, index) => (
        <Message
          key={message.id ?? `${message.sender}-${message.createdAt ?? index}`}
          sender={message.sender}
          message={message.message}
        />
      ))}
    </div>
  );
}

export function MessageInput({ handleSendMessage }) {
  const runameRef = useRef(null);
  const xtextRef = useRef(null);

  return (
    <div id="message-input" className="message-input">
      <input ref={runameRef} type="text" id="runame-i" />
      <input ref={xtextRef} type="text" id="xtext-i" />
      <button
        type="button"
        id="sendMessage-button"
        onClick={() =>
          handleSendMessage(runameRef.current.value, xtextRef.current.value)
        }
      >
        Send!
      </button>
    </div>
  );
}

export function MessageBoard({
  activeDialogueUser,
  dialogues,
  onActiveDialogueUserChange,
  onMessageSent,
}) {
  async function handleSendMessage(recipientUser, text) {
    const recipient = recipientUser.trim();
    const message = text.trim();
    if (!recipient || !message) return;

    const sentMessage = await sendMessage(recipient, message);
    if (sentMessage) {
      onMessageSent(sentMessage);
    }
  }

  return (
    <>
      <div id="dialogue-tabs" className="dialogue-tabs">
        {Object.keys(dialogues).map((username) => (
          <button
            key={username}
            type="button"
            className={username === activeDialogueUser ? 'active-tab' : ''}
            onClick={() => onActiveDialogueUserChange(username)}
          >
            {username}
          </button>
        ))}
      </div>
      <div id="dialogue-windows" className="dialogue-windows">
        {activeDialogueUser && (
          <section
            key={activeDialogueUser}
            className="dialogue-window active-dialogue"
          >
            <MessageList
              messages={dialogues[activeDialogueUser]?.messages ?? []}
            />
          </section>
        )}
      </div>
      <MessageInput handleSendMessage={handleSendMessage} />
    </>
  );
}
