import { Server } from 'http';
import socketio from 'socket.io';

interface IPrivateChatOrRoomChat {
  private?: string;
  room?: string;
}

class Websocket {
  socketIO(httpServer: Server) {
    // socket.emit() = Emit single client
    // socket.broadcast.emit() = Emit all client except you
    // io.emit() = Emit all client

    const io = socketio(httpServer);

    io.origins('*:*');

    io.on('connection', socket => {
      console.log(`New websocket connection: ${socket.id}`);

      // Listen users joined in room
      socket.on('joinChatRoom', (nickname: string) => {
        socket.join(nickname);
        socket.emit('updateUsersInRoom', nickname);
      });

      // Join user in private room
      socket.on('joinChatPrivate', (id: string) => {
        console.log('EMAIL: ', id);
        console.log('SOCKETID: ', socket.id);
        console.log('ROOMS: ', socket.rooms);
        socket.join(id);
      });

      // Listen to new message
      socket.on(
        'chatMessage',
        (privateChatOrRoomChat: IPrivateChatOrRoomChat) => {
          if (privateChatOrRoomChat?.private) {
            // Is private chat
            io.sockets.in(privateChatOrRoomChat?.private).emit('message', true);
          }

          if (privateChatOrRoomChat?.room) {
            // Is room chat
            io.sockets.in(privateChatOrRoomChat?.room)
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
