import {useState, useRef} from 'react';
import ReactDOM from 'react-dom/client';
import { sendMessage } from '../services/messages-api';

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

export function MessageInput({ handleSendMessage }){
    const runameRef = useRef(null);
    const xtextRef = useRef(null);

    return (
        <div id="message-input">
            <input ref={runameRef} type="text" id="runame-i" />
            <input ref={xtextRef} type="text" id="xtext-i" />
            <button
                type="button"
                id="test-button"
                onClick={() => handleSendMessage(runameRef.current.value, xtextRef.current.value)}
            >
            Send!
            </button>
        </div>
    )
    
}

export function MessageBoard({ messages, onMessageSent }) {

    async function handleSendMessage(recipientUser, text) {
    
        const message = text.trim();
        if (!message) return;
    
        const sentMessage = await sendMessage(recipientUser, message);
        if (sentMessage) {
          onMessageSent(sentMessage);
        }
    }

    return (
        <>
            <MessageList messages={messages} />
            <MessageInput handleSendMessage={handleSendMessage}/>
        </>
    )
}