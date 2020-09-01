import { Server } from 'http';
import socketio from 'socket.io';

interface IPrivateChatOrRoomChat {
  email?: string;
  nickname?: string;
}

class Websocket {
  socketIO(httpServer: Server) {
    // socket.emit() = Emit single client
    // socket.broadcast.emit() = Emit all client except you
    // io.emit() = Emit all client

    const io = socketio(httpServer);

    io.origins('*:*');

    io.on('connection', socket => {
      console.log('New websocket connection.');

      // Listen users joined in room
      socket.on('joinRoomChat', (nickname: string) => {
        socket.join(nickname);
        socket.emit('updateUsersInRoom', nickname);
      });

      // Join user in private room
      socket.on('joinPrivateChat', (email: string) => {
        socket.join(email);
      });

      // Listen to new message
      socket.on(
        'chatMessage',
        (privateChatOrRoomChat: IPrivateChatOrRoomChat) => {
          if (privateChatOrRoomChat?.email) {
            // Is private chat
            io.sockets.in(privateChatOrRoomChat?.email).emit('message', true);
          }

          if (privateChatOrRoomChat?.nickname) {
            // Is room chat
            io.sockets.in(privateChatOrRoomChat?.nickname)
              .emit('message', true);
          }
        },
      );

      // Listen handle participants in room
      socket.on('handleParticipantsInRoom', () => {
        socket.emit('refreshParticipantsInroom', true);
      });

      // Listen updating and emit update for main page
      socket.on('updateLatestPrivateMessage', (response: boolean) => {
        if (response) {
          socket.emit('updateLatestPrivateMessage', true);
        }
      });

      socket.on('updateLatestRoomMessage', (response: boolean) => {
        if (response) {
          socket.emit('updateLatestRoomMessage', true);
        }
      });

      // Runs when client disconnects
      socket.on('disconnect', () => {
        io.emit('messagee', 'A user has left the chat.');
      });
    });
  }

}

export default new Websocket;
