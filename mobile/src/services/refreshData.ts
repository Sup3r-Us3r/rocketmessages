import socket from './websocket';
import api from './api';

export function handlePrivateJoinUsers(myId: number, userId: number) {
  const usersJoined = [myId, userId].sort((a, b) => a - b).join('-');

  return {
    emit: () => socket.emit('joinChatPrivate', usersJoined),
    usersJoined,
  };
}

export function handleMessageRefresh(myId: number, userId: number) {
  return socket.emit('messageRefresh', [myId, userId]);
}
