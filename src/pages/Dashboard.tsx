import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { getUserFromToken } from '../utils/token';
import socket from '@/services/NotificationService'; // Ensure socket is properly configured
import { fetchNotifications } from '@/services/notifications';

export default function Dashboard() {
  const user = getUserFromToken();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // For loading state

  // Fetch notifications on component mount
  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      try {
        const data = await fetchNotifications(); // Use axios to fetch notifications
        setNotifications(data);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();

    // Listen for new notifications from Socket.io
    socket.on('new_notification', (newNotification) => {
      setNotifications((prev) => [...prev, newNotification]);
    });

    // Cleanup the event listener on unmount
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
          {loading ? (
            <p>Loading notifications...</p>
          ) : notifications.length === 0 ? (
            <p>No notifications available</p>
          ) : (
            <ul>
              {notifications.map((notification) => (
                <li key={notification.id} className="bg-gray-700 p-3 rounded-md mb-2">
                  {notification.content}
                  {/* You can add logic here for marking as read, etc. */}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
