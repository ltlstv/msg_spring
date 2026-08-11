export function MessageList({ messages }) {
  return (
    <div className="message-list" aria-live="polite">
      {messages.map((message, index) => (
        <article
          className="message"
          key={message.id ?? `${message.sender}-${index}`}
        >
          <h3>{message.sender}</h3>
          <p>{message.message}</p>
        </article>
      ))}
    </div>
  );
}
