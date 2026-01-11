import React, { useState, useCallback } from 'react';
import { ChatMessage, MessageSender } from './types';
import { sendMessageToGemini } from './services/geminiService';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendMessage = useCallback(async (text: string) => {
    const newUserMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: text,
      sender: MessageSender.User,
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setIsLoading(true);

    try {
      const lvachirResponseText = await sendMessageToGemini(text, messages);

      const newLvachirMessage: ChatMessage = {
        id: `lvachirpt-${Date.now()}`,
        text: lvachirResponseText,
        sender: MessageSender.Lvachir,
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, newLvachirMessage]);
    } catch (error) {
      console.error('Failed to get response from LvachirPT:', error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        text: "Désolé, une erreur est survenue lors de la communication avec LvachirPT. Veuillez réessayer plus tard.",
        sender: MessageSender.Lvachir,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]); // messages dependency is needed to pass current history to geminiService

  return (
    <div className="flex flex-col h-full w-full">
      <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-4 shadow-md text-center sticky top-0 z-10">
        <h1 className="text-2xl md:text-3xl font-extrabold flex items-center justify-center">
          <svg className="w-8 h-8 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
          LvachirPT - Votre Expert Hydraulique en Algérie
        </h1>
        <p className="text-sm mt-1 opacity-90">Posez vos questions et obtenez des solutions précises.</p>
      </header>
      <ChatWindow messages={messages} isLoading={isLoading} />
      <MessageInput onSendMessage={handleSendMessage} isDisabled={isLoading} />
    </div>
  );
};

export default App;