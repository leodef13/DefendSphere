import React from 'react';
import { Bot, X } from 'lucide-react';

interface AssistantButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

const AssistantButton: React.FC<AssistantButtonProps> = ({ isOpen, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-[#56a3d9] to-[#134876] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center text-white"
      aria-label={isOpen ? 'Close Security Assistant' : 'Open Security Assistant'}
    >
      {isOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <Bot className="h-6 w-6" />
      )}
    </button>
  );
};

export default AssistantButton;