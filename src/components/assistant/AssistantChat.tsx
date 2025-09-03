import React, { useRef, useEffect } from 'react';
import { Send, X, Bot, User } from 'lucide-react';
import { useAssistant } from '../../hooks/useAssistant';

interface AssistantChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const AssistantChat: React.FC<AssistantChatProps> = ({ isOpen, onClose }) => {
  const { messages, isTyping, sendMessage } = useAssistant();
  const [inputValue, setInputValue] = React.useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    await sendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessage = (message: any) => {
    const isUser = message.sender === 'user';
    
    return (
      <div
        key={message.id}
        className={`flex items-start space-x-3 mb-4 ${
          isUser ? 'flex-row-reverse space-x-reverse' : ''
        }`}
      >
        {/* Аватар */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser 
            ? 'bg-[#56a3d9] text-white' 
            : 'bg-gradient-to-r from-[#56a3d9] to-[#134876] text-white'
        }`}>
          {isUser ? (
            <User className="h-4 w-4" />
          ) : (
            <Bot className="h-4 w-4" />
          )}
        </div>
        
        {/* Сообщение */}
        <div className={`max-w-[80%] ${isUser ? 'text-right' : ''}`}>
          <div className={`rounded-lg px-4 py-2 ${
            isUser 
              ? 'bg-[#56a3d9] text-white' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            <p className="text-sm whitespace-pre-wrap">{message.text}</p>
          </div>
          
          {/* Время */}
          <p className={`text-xs text-gray-500 mt-1 ${
            isUser ? 'text-right' : ''
          }`}>
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          
          {/* Дополнительные данные */}
          {message.data && message.type === 'link' && (
            <div className="mt-2">
              <a
                href={message.data.url}
                className="text-[#56a3d9] hover:text-[#134876] text-sm underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {message.data.title}
              </a>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col">
      {/* Заголовок */}
      <div className="bg-gradient-to-r from-[#56a3d9] to-[#134876] text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <div>
              <h3 className="font-semibold">Security Assistant</h3>
              <p className="text-xs opacity-90">AI-powered security guidance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Close chat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Сообщения */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="space-y-4">
          {messages.map(renderMessage)}
          
          {/* Индикатор печати */}
          {isTyping && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-[#56a3d9] to-[#134876] rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Поле ввода */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about security, compliance, or dashboard features..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9] focus:border-transparent text-sm"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="px-4 py-2 bg-[#56a3d9] text-white rounded-md hover:bg-[#134876] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        
        {/* Быстрые вопросы */}
        <div className="mt-3 flex flex-wrap gap-2">
          {['ISO 27001', 'GDPR', 'Assets', 'Compliance'].map((topic) => (
            <button
              key={topic}
              onClick={() => setInputValue(`Tell me about ${topic}`)}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssistantChat;