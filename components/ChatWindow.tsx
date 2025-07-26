
import React, { useEffect, useRef } from 'react';
import MessageComponent from './Message';
import LoadingSpinner from './LoadingSpinner';
import type { Message } from '../types';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {messages.map((msg) => (
        <MessageComponent key={msg.id} message={msg} />
      ))}
      {isLoading && (
        <div className="flex justify-start">
            <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-md">
                    <LoadingSpinner />
                </div>
            </div>
        </div>
      )}
      <div ref={chatEndRef} />
    </div>
  );
};

export default ChatWindow;
