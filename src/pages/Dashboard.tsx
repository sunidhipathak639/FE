import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout'
import { getUserFromToken } from '../utils/token'
import socket from '@/services/NotificationService';

export default function Dashboard() {
  const user = getUserFromToken()
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    // Fetch existing notifications on component mount
const fetchNotifications = async () => {
  const response = await fetch('/api/notifications', {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache', // Prevent caching
    },
  });
  
  if (response.ok) {
    const data = await response.json();
    setNotifications(data);
  } else {
    console.error('Failed to fetch notifications');
  }
};


    fetchNotifications();

    // Listen for new notifications
    socket.on('new_notification', (newNotification) => {
      setNotifications((prev) => [...prev, newNotification]);
    });

    // Cleanup on unmount
    return () => {
      socket.off('new_notification');
    };
  }, []);
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Welcome to the Dashboard</h2>
        {user ? (
          <p className="text-gray-100 text-lg">
            Hello <span className="font-semibold">{user.name || 'User'}</span>! You are logged in as{' '}
            <span className="font-semibold">{user.role}</span>.
          </p>
        ) : (
          <p className="text-red-500">User information not found. Please log in again.</p>
        )}
            <div>
      <h1>Notifications</h1>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>
            {notification.content}
            {/* You can add additional logic for marking as read, etc. */}
          </li>
        ))}
      </ul>
    </div>
      </div>
    </DashboardLayout>
  )
}
