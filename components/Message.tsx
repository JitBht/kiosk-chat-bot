import React from 'react';
import { Sender, type Message } from '../types';

interface MessageProps {
  message: Message;
}

const UserAvatar: React.FC = () => (
    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    </div>
);

const BotAvatar: React.FC = () => (
     <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    </div>
);

const WarningIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mr-2 shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
);

const PillIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 3.5a1.5 1.5 0 011.06.44l4.5 4.5a1.5 1.5 0 010 2.12l-4.5 4.5A1.5 1.5 0 0110 13.5H3A1.5 1.5 0 011.5 12V6A1.5 1.5 0 013 4.5h7a.5.5 0 000-1H3a2.5 2.5 0 00-2.5 2.5v6A2.5 2.5 0 003 14.5h7a2.5 2.5 0 001.768-.732l4.5-4.5a2.5 2.5 0 000-3.536l-4.5-4.5A2.5 2.5 0 0010 3.5z" />
        <path d="M13 8a1 1 0 100-2 1 1 0 000 2z" />
    </svg>
);

const LabTestIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-500 mr-2 shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
    </svg>
);


const MessageComponent: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === Sender.User;

  if (isUser) {
    return (
      <div className="flex justify-end items-start space-x-3">
        <div className="bg-blue-500 text-white p-4 rounded-lg rounded-br-none shadow-md max-w-lg">
          <p className="text-base">{message.text}</p>
        </div>
        <UserAvatar />
      </div>
    );
  }

  return (
    <div className="flex justify-start items-start space-x-3">
      <BotAvatar />
      <div className="bg-white p-4 rounded-lg rounded-bl-none shadow-md max-w-lg space-y-4">
        <p className="text-gray-700 text-base whitespace-pre-wrap">{message.text}</p>
        {message.isRecommendation && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-lg flex items-center">
            <WarningIcon />
            <p className="font-semibold">Urgent: Consultation Recommended</p>
          </div>
        )}
        {message.suggestions && message.suggestions.length > 0 && (
          <div>
            <h3 className="font-bold text-gray-800 mb-2">General Suggestions:</h3>
            <ul className="space-y-2">
              {message.suggestions.map((med, index) => (
                <li key={index} className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-md">
                   <PillIcon />
                  <span>{med}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {message.labTests && message.labTests.length > 0 && (
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Suggested Lab Tests:</h3>
            <ul className="space-y-2">
              {message.labTests.map((test, index) => (
                <li key={index} className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-md">
                   <LabTestIcon />
                  <span>{test}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageComponent;