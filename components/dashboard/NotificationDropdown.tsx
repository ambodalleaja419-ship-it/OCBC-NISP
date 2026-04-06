import React, { useRef, useEffect } from 'react';
import { NotificationItem } from '../../types';
import { useTransactions } from '../../context/TransactionContext';

interface NotificationDropdownProps {
  notifications: NotificationItem[];
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ notifications, onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { markNotificationAsRead } = useTransactions();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleNotificationClick = (notificationId: string) => {
    markNotificationAsRead(notificationId);
    // Optionally close dropdown after clicking a notification
    // onClose();
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-72 bg-darkblue2 border border-gray-700 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto"
    >
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">Notifications</h3>
      </div>
      {notifications.length === 0 ? (
        <p className="p-4 text-gray-400 text-sm">No new notifications.</p>
      ) : (
        <ul>
          {notifications.map((notif) => (
            <li
              key={notif.id}
              className={`p-4 border-b border-gray-700 last:border-b-0 cursor-pointer ${
                notif.read ? 'bg-darkblue' : 'bg-darkblue2 hover:bg-gray-800'
              }`}
              onClick={() => handleNotificationClick(notif.id)}
            >
              <p className={`text-sm ${notif.read ? 'text-gray-400' : 'text-white font-medium'}`}>{notif.message}</p>
              <p className="text-xs text-gray-500 mt-1">{new Date(notif.date).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationDropdown;
