import React, { useState } from 'react';
// Custom Toast Component
export default function Toast  ({ message, type, onClose }){
  React.useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const typeStyles = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700'
  };

  return (
    <div 
      className={`fixed top-4 right-4 z-100 px-4 py-3 border-l-4 rounded-lg shadow-lg ${typeStyles[type]} transition-all duration-300 ease-in-out`}
      role="alert"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm">{message}</p>
        <button 
          onClick={onClose} 
          className="ml-4 text-gray-500 hover:text-gray-800 focus:outline-none"
        >
          ×
        </button>
      </div>
    </div>
  );
};