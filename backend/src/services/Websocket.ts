import { Server } from 'http';
import socketio from 'socket.io';

interface IPrivateChatOrRoomChat {
  private?: string;
  room?: string;
}

interface IUserData {
  socketId: string;
  email: string;
}

class Websocket {
  private users: IUserData[] = [];
  
  usersOnline(userData: IUserData) {
    if (!this.users.find((user: IUserData) => user.email === userData.email)) {
      this.users.push(userData);
    }

    return this.users;
  }

  socketIO(httpServer: Server) {
    // socket.emit() = Emit single client
    // socket.broadcast.emit() = Emit all client except you
    // io.emit() = Emit all client

    const io = socketio(httpServer);

    io.origins('*:*');

    io.on('connection', socket => {
      console.log(`New websocket connection: ${socket.id}`);

      // Emit users online
      socket.on('userOnline', (userData: IUserData) => {
        this.usersOnline(userData);
      });

      socket.on('checkUserOnline', (email: string) => {
        const userOnline = this.users.some(
          (user: IUserData) => user.email === email
        );

        io.emit('checkUserOnline', userOnline);
      });

      // Listen users joined in room
      socket.on('joinChatRoom', (nickname: string) => {
        socket.join(nickname);
        socket.emit('updateUsersInRoom', nickname);
      });

      // Join user in private room
      socket.on('joinChatPrivate', (id: string) => {
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
        // this.users.splice(
        //   this.users.findIndex(
        //     (user: IUserData) => user.socketId === socket.id
        //   ), 1
        // );

        // console.log('USERS2: ', this.users);
      });
    });
  }

}

export default new Websocket;
