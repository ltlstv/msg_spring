import { useMessages } from '../hooks/useMessages.js';
import { MessageComposer } from './MessageComposer.jsx';
import { MessageList } from './MessageList.jsx';

export function ChatPanel({ className = '', currentUser, token }) {
  const messages = useMessages({ token, currentUser });

  return (
    <section className={`app-window ${className}`}>
      <header className="app-window__header">Chat</header>
      <div className="app-window__body">
        <div className="button-row">
          <button
            type="button"
            disabled={!token}
            onClick={messages.loadHistory}
          >
            Load messages
          </button>
        </div>

        {messages.error ? <p role="alert">{messages.error}</p> : null}

        <MessageList messages={messages.messages} />

        <MessageComposer disabled={!token} onSend={messages.sendMessage} />
      </div>
    </section>
  );
}
