import React, { useState } from 'react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isDisabled: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isDisabled }) => {
  const [input, setInput] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() && !isDisabled) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-50 border-t border-gray-200 flex items-center sticky bottom-0 z-10">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={isDisabled ? "LvachirPT est en train de répondre..." : "Posez votre question sur l'hydraulique en Algérie..."}
        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm md:text-base"
        disabled={isDisabled}
      />
      <button
        type="submit"
        className={`ml-3 px-5 py-3 rounded-lg font-semibold text-white transition-colors duration-200 ${
          input.trim() && !isDisabled
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-blue-400 cursor-not-allowed'
        }`}
        disabled={isDisabled || !input.trim()}
      >
        Envoyer
      </button>
    </form>
  );
};

export default MessageInput;