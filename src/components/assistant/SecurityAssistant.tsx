import React, { useState } from 'react';
import AssistantButton from './AssistantButton';
import AssistantChat from './AssistantChat';

const SecurityAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  return (
    <>
      <AssistantButton isOpen={isOpen} onToggle={toggleChat} />
      <AssistantChat isOpen={isOpen} onClose={closeChat} />
    </>
  );
};

export default SecurityAssistant;