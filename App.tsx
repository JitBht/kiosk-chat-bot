import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import { sendChatMessage } from './services/geminiService';
import { INITIAL_BOT_MESSAGE } from './constants';
import { Sender, type Message, BotResponseType } from './types';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_BOT_MESSAGE]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = useCallback(async (inputText: string) => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: uuidv4(),
      text: inputText,
      sender: Sender.User,
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const botResponse = await sendChatMessage(inputText);
      
      const botMessage: Message = {
        id: uuidv4(),
        sender: Sender.Bot,
        text: botResponse.message,
        suggestions: botResponse.suggestions,
        labTests: botResponse.labTests,
        isRecommendation: botResponse.responseType === BotResponseType.SUGGEST_CONSULTATION
      };

      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (e) {
      console.error(e);
      const errorMessage = 'I seem to be having trouble connecting. Please try again in a moment.';
      setError(errorMessage);
       const botErrorMessage: Message = {
        id: uuidv4(),
        sender: Sender.Bot,
        text: errorMessage,
      };
      setMessages(prevMessages => [...prevMessages, botErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen max-h-screen bg-blue-50 font-sans">
        <header className="bg-white shadow-md p-4 z-10">
            <div className="max-w-4xl mx-auto flex items-center space-x-3">
                <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Kiosk Health Assistant</h1>
                    <p className="text-sm text-gray-500">Your virtual guide to general health suggestions</p>
                </div>
            </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4">
            <ChatWindow messages={messages} isLoading={isLoading} />
        </main>

        <footer className="bg-white border-t border-gray-200 p-4">
            <div className="max-w-4xl mx-auto">
                 <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
                 {error && <p className="text-red-500 text-center text-sm mt-2">{error}</p>}
            </div>
        </footer>
    </div>
  );
};

export default App;