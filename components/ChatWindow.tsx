import React, { useRef, useEffect } from 'react';
import { ChatMessage, MessageSender } from '../types';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]); // Scroll to bottom when messages or loading state changes

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.sender === MessageSender.User ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[75%] p-3 rounded-xl shadow-md ${
              message.sender === MessageSender.User
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
            }`}
          >
            <span className={`block text-xs font-semibold mb-1 ${
                message.sender === MessageSender.User ? 'text-blue-200' : 'text-gray-500'
            }`}>
              {message.sender === MessageSender.User ? 'Vous' : 'LvachirPT'}
            </span>
            <p className="text-sm md:text-base whitespace-pre-wrap">{message.text}</p>
            <span className="block text-xs text-opacity-75 mt-1">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-[75%] p-3 rounded-xl shadow-md bg-white border border-gray-200 text-gray-800 rounded-tl-none animate-pulse">
            <span className="block text-xs font-semibold mb-1 text-gray-500">LvachirPT</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></div>
              <span className="ml-2 text-sm">LvachirPT réfléchit...</span>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} /> {/* Scroll target */}
    </div>
  );
};

export default ChatWindow;