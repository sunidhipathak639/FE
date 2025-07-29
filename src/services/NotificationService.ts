import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

// Listen for new notifications
socket.on('new_notification', (notification: any) => {
  console.log('New Notification: ', notification);
  // You can store this in state or show it using a toast
});

export default socket;
