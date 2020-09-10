import socket from './websocket';

interface IUserData {
  socketId: string;
  email: string;
}

export default function handleEmitUserOnline(userData: IUserData) {
  return socket.emit('userOnline', userData);
}
