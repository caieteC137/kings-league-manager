
import React from 'react';

interface NotificationProps {
  message: string | null;
}

const Notification: React.FC<NotificationProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-bounce">
      <div className="bg-white text-black px-6 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-3">
        <i className="fa-solid fa-circle-exclamation text-yellow-500"></i>
        {message}
      </div>
    </div>
  );
};

export default Notification;
