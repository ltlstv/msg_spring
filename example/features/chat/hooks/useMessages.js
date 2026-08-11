import { useEffect, useRef, useState } from 'react';
import { getMessageHistory } from '../api/messagesApi.js';
import { createChatSocket } from '../realtime/chatSocket.js';

export function useMessages({ token, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) {
      setMessages([]);
      return undefined;
    }

    socketRef.current = createChatSocket({
      token,
      onMessage: (message) => setMessages((prev) => [...prev, message]),
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  async function loadHistory() {
    if (!token) return;

    try {
      setError('');
      setMessages(await getMessageHistory(token));
    } catch (error) {
      setError(error.message);
    }
  }

  function sendMessage({ recipientUser, message }) {
    if (!message.trim() || !socketRef.current) return;

    socketRef.current.sendMessage({
      recipientUser: recipientUser.trim(),
      message: message.trim(),
    });

    setMessages((prev) => [
      ...prev,
      {
        sender: currentUser,
        message: message.trim(),
      },
    ]);
  }

  return {
    error,
    messages,
    loadHistory,
    sendMessage,
  };
}
