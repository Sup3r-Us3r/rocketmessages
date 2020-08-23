import { Server } from 'http';
import socketio from 'socket.io';

interface IUserJoinedInRoom {
  id: number | string;
  username: string;
  nickname: string;
}

interface IJoinPrivate {
  email: string;
}

interface IPrivateChatOrRoomChat {
  email?: string;
  nickname?: string;
}

class Websocket {
  private usersArray = [] as IUserJoinedInRoom[];

  private joinUserInRoom(id: string, username: string, nickname: string) {
    const user = {id, username, nickname};

    this.usersArray.push(user);

    return user;
  }

  private getCurrentUser(id: string) {
    return this.usersArray.find((user: IUserJoinedInRoom) => user.id === id);
  }

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
        // console.log(userJoined);
        // const currentUserForJoin = this.joinUserInRoom(
        //   socket.id,
        //   userJoined.username,
        //   userJoined.nickname,
        // );

        socket.join(nickname);

        // Welcome current user
        // socket.to(currentUserForJoin.nickname)
        //  .emit('message', 'Welcome to Rocket Messages');

        // Broadcast when a user connects
        // socket.broadcast.to(currentUserForJoin.nickname)
        //  .emit('message', '');

        socket.emit('updateUsersInRoom', nickname);
      });

      // Join user in private room
      socket.on('joinPrivateChat', ({email}: IJoinPrivate) => {
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
            io.to(privateChatOrRoomChat?.nickname)
              .emit('message', true);

            // const currentUser = this.getCurrentUser(socket.id);
            // io.to(String(currentUser?.nickname)).emit('message', true);
          }
        },
      );

      // Listen handle participants in room
      socket.on('handleParticipantsInRoom', () => {
        socket.emit('refreshParticipantsInroom', true);
      });

      // Runs when client disconnects
      socket.on('disconnect', () => {
        io.emit('messagee', 'A user has left the chat.');
      });
    });
  }

}

export default new Websocket;
