import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Room, Service } from '@shared/schema';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';

// Define the chatbot context type
interface ChatbotContextType {
  showChatbot: () => void;
  hideChatbot: () => void;
  isVisible: boolean;
}

// Create the context
const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

// Define the provider props
interface ChatbotProviderProps {
  children: ReactNode;
}

export function ChatbotProvider({ children }: ChatbotProviderProps) {
  const [isVisible, setIsVisible] = useState(false);

  // For rooms data
  const {
    data: rooms,
    error: roomsError,
    isLoading: roomsLoading,
  } = useQuery<Room[]>({
    queryKey: ['/api/rooms'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // For services data
  const {
    data: services,
    error: servicesError,
    isLoading: servicesLoading,
  } = useQuery<Service[]>({
    queryKey: ['/api/services'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Expose methods to show/hide the chatbot
  const showChatbot = () => setIsVisible(true);
  const hideChatbot = () => setIsVisible(false);

  // Make the rooms and services data available for the chatbot to use in responses
  useEffect(() => {
    if (rooms && services) {
      // Initialize with available data
      window.hotelData = {
        rooms,
        services,
      };
    }
  }, [rooms, services]);

  return (
    <ChatbotContext.Provider
      value={{
        showChatbot,
        hideChatbot,
        isVisible,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
}

// Custom hook to use the chatbot context
export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
}

// Declare global window property for hotel data
declare global {
  interface Window {
    hotelData: {
      rooms: Room[];
      services: Service[];
    };
  }
}