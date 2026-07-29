import React from 'react';
import ReactDOM from 'react-dom/client';

export function Message( {sender, message }) {
    return (
        <article className="message">
            <h3>{sender}</h3>
            <p>{message}</p>
        </article>
    )
}

export function MessageList({ messages }) {
    return (
        <div id="message-container">
            {messages.map((message) => (
                <Message
                key={message.id ?? `${message.sender}-${message.createdAt}`}
                sender={message.sender}
                message={message.message}
                />
            ))}
        </div>
    )
}