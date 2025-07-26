
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
        <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-pulse"></div>
        <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-pulse delay-75"></div>
        <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-pulse delay-150"></div>
        <span className="text-gray-500 text-sm">Thinking...</span>
    </div>
  );
};

export default LoadingSpinner;
