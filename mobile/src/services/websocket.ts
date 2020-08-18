import socketio from 'socket.io-client';

const socket = socketio(
  process.env.REACT_BASE_URL || 'http://192.168.2.8:3333',
);

socket.on('connect', () => {
  console.log('[IO] - A new connection has been established.');
});

export default socket;
