import { Server } from 'http';
import socketio from 'socket.io';

interface IUsersJoinedInRoom {
  id: number;
  username: string;
  photo: string;
  status: string;
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

      // Welcome current user
      // socket.broadcast.emit('message', 'Welcome to Rocket Messages');

      // Broadcast when a user connects
      // socket.broadcast.emit('message', '');

      // Listen users joined in room
      socket.on('joinRoom', (usersJoined: IUsersJoinedInRoom) => {
        socket.emit('updateUsersJoined', true);
      });

      // Listen to new message
      socket.on('chatMessage', (message: string) => {
        io.emit('message', message);
      });

      // Runs when client disconnects
      socket.on('disconnect', () => {
        io.emit('messagee', 'A user has left the chat.');
      });
    });
  }

}

export default new Websocket;
