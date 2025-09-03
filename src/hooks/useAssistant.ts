import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  ChatMessage, 
  AssistantRequest, 
  AssistantResponse, 
  AssistantLog 
} from '../types/assistant';

interface UseAssistantReturn {
  messages: ChatMessage[];
  isTyping: boolean;
  sendMessage: (message: string) => Promise<void>;
  clearChat: () => void;
  getChatHistory: () => Promise<AssistantLog[]>;
  isLoading: boolean;
}

export const useAssistant = (): UseAssistantReturn => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: `Hello, @${user?.username || 'User'}! I'm your security assistant. How can I help you with your compliance needs today?`,
      sender: 'assistant',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || !user) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: messageText.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const request: AssistantRequest = {
        message: messageText.trim(),
        userId: user.id,
        userRole: user.role
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify(request)
      });

      if (response.ok) {
        const data: AssistantResponse = await response.json();
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: 'assistant',
          timestamp: new Date(),
          type: data.type || 'text',
          data: data.data
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Fallback response if API is unavailable
        const fallbackResponse = generateFallbackResponse(messageText.trim());
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: fallbackResponse,
          sender: 'assistant',
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Fallback response on error
      const fallbackResponse = generateFallbackResponse(messageText.trim());
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: fallbackResponse,
        sender: 'assistant',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [user]);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: '1',
        text: `Hello, @${user?.username || 'User'}! I'm your security assistant. How can I help you with your compliance needs today?`,
        sender: 'assistant',
        timestamp: new Date(),
        type: 'text'
      }
    ]);
  }, [user]);

  const getChatHistory = useCallback(async (): Promise<AssistantLog[]> => {
    if (!user) return [];

    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/assistant/logs`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || sessionStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.logs || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Fallback response generator
  const generateFallbackResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    // Security standards
    if (lowerMessage.includes('iso') || lowerMessage.includes('27001')) {
      return "ISO/IEC 27001 is an international standard for information security management systems (ISMS). It provides a framework for establishing, implementing, maintaining, and continually improving information security. Would you like me to help you understand specific requirements or implementation steps?";
    }
    
    if (lowerMessage.includes('gdpr')) {
      return "GDPR (General Data Protection Regulation) is a comprehensive data protection law in the EU. It regulates how organizations collect, process, and protect personal data. Key principles include data minimization, purpose limitation, and individual rights. How can I assist you with GDPR compliance?";
    }
    
    if (lowerMessage.includes('dora')) {
      return "DORA (Digital Operational Resilience Act) is an EU regulation that enhances the digital operational resilience of the financial sector. It covers ICT risk management, incident reporting, and digital resilience testing. What specific aspect would you like to know more about?";
    }
    
    if (lowerMessage.includes('nis2')) {
      return "NIS2 (Network and Information Security Directive) is an EU directive that strengthens cybersecurity requirements for essential and important entities. It covers risk management, incident reporting, and security measures. Would you like information on compliance requirements?";
    }
    
    // Dashboard sections
    if (lowerMessage.includes('compliance') || lowerMessage.includes('соответствие')) {
      return "The Compliance section helps you monitor and manage compliance with security standards. You can view compliance scores, audit information, and track progress towards various certifications. Would you like me to guide you to specific compliance areas?";
    }
    
    if (lowerMessage.includes('assets') || lowerMessage.includes('активы')) {
      return "The Assets section provides monitoring and management of your digital assets including servers, databases, endpoints, and mobile devices. You can view asset inventory, status, risk levels, and vulnerabilities. How can I help you with asset management?";
    }
    
    if (lowerMessage.includes('reports') || lowerMessage.includes('отчеты')) {
      return "The Reports section allows you to generate and view security reports. You can select report types, date ranges, and export results. What type of report would you like to create?";
    }
    
    if (lowerMessage.includes('suppliers') || lowerMessage.includes('поставщики')) {
      return "The Suppliers section helps you manage third-party supplier security and compliance. You can view supplier directory, security scores, risk levels, and assessment schedules. How can I assist you with supplier management?";
    }
    
    // General help
    if (lowerMessage.includes('help') || lowerMessage.includes('помощь')) {
      return "I can help you with: \n• Security compliance standards (ISO 27001, GDPR, DORA, NIS2)\n• Dashboard navigation and features\n• Asset management and monitoring\n• Report generation and analysis\n• Supplier security assessment\n\nWhat would you like to know more about?";
    }
    
    return "I understand your question about DefendSphere. I can help you with security compliance, asset management, reporting, and navigating the dashboard. Could you please be more specific about what you'd like to know?";
  };

  return {
    messages,
    isTyping,
    sendMessage,
    clearChat,
    getChatHistory,
    isLoading
  };
};