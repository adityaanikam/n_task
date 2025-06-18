import { useState, useRef, useEffect } from 'react';
import { ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { apiService } from '../services/api';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatProps {
  userId: number;
  groupId?: number;
}

export default function Chat({ userId, groupId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await apiService.askQuestion(input, userId, groupId);
      const botMessage: Message = {
        id: Date.now() + 1,
        text: response.data.answer,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Bubble */}
      {!isOpen && (
        <div 
          className="chat-bubble"
          onClick={() => setIsOpen(true)}
          title="Open Chat Assistant"
        >
          <ChatBubbleLeftRightIcon style={{ width: '28px', height: '28px', color: 'white' }} />
        </div>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <div className="chat-interface">
          {/* Header */}
          <div style={{
            backgroundColor: '#7C3AED',
            color: 'white',
            padding: '16px',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '500', margin: 0 }}>
              Expense Assistant
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '4px'
              }}
              title="Close Chat"
            >
              <XMarkIcon style={{ width: '20px', height: '20px' }} />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            backgroundColor: '#f9fafb'
          }}>
            {messages.length === 0 && (
              <div style={{
                textAlign: 'center',
                color: '#6b7280',
                fontSize: '14px',
                padding: '20px'
              }}>
                Hi! I'm your expense assistant. Ask me anything about expenses, balances, or how to use the app.
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                  marginBottom: '12px'
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: message.isUser ? '#7C3AED' : 'white',
                    color: message.isUser ? 'white' : '#1f2937',
                    border: message.isUser ? 'none' : '1px solid #e5e7eb',
                    fontSize: '14px',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div>{message.text}</div>
                  <div style={{
                    fontSize: '11px',
                    opacity: 0.7,
                    textAlign: 'right',
                    marginTop: '4px'
                  }}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}>
                <div style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                }}>
                  <div className="loading-spinner"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} style={{
            padding: '16px',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: 'white',
            borderBottomLeftRadius: '12px',
            borderBottomRightRadius: '12px'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about expenses..."
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#7C3AED'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                style={{
                  backgroundColor: '#7C3AED',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                  opacity: isLoading || !input.trim() ? 0.5 : 1
                }}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
} 