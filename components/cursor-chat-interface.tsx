import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToAI } from '../utils/api';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

interface CursorChatInterfaceProps {
  initialMessages?: Message[];
  onSendMessage: (message: string) => void;
  onSelectContent: (content: string) => void;
}

export function CursorChatInterface({ 
  initialMessages = [], 
  onSendMessage, 
  onSelectContent 
}: CursorChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    // Call the onSendMessage prop
    onSendMessage(currentMessage);

    // Add user message to chat
    const userMessage: Message = { sender: 'user', text: currentMessage };
    setMessages((prev) => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);
    setError(null);

    try {
      // Call AI API
      const response = await sendMessageToAI(currentMessage);
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.text) {
        // Add AI response to chat
        setMessages((prev) => [...prev, { sender: 'ai', text: response.text }]);
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-interface">
      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender}`}
            onClick={() => message.sender === 'ai' && onSelectContent(message.text)}
          >
            <div className="message-content">
              {message.sender === 'user' ? 'You: ' : 'AI: '}
              {message.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message ai">
            <div className="message-content">AI is thinking...</div>
          </div>
        )}
        {error && (
          <div className="message error">
            <div className="message-content">{error}</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="message-input">
        <textarea
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={isLoading}
        />
        <button onClick={handleSendMessage} disabled={isLoading}>
          Send
        </button>
      </div>
    </div>
  );
}