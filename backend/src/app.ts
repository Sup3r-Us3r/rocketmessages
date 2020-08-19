import 'dotenv/config';

import express from 'express';
import { createServer } from 'http';
import socketio from 'socket.io';
import cors from 'cors';
import { resolve } from 'path';

import routes from './routes';

class App {
  public server = express();
  public httpServer = createServer(this.server);

  constructor() {
    this.middlewares();
    this.websocket();
  }
  
  middlewares() {
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: false }));
    this.server.use(cors());
    this.server.use(
      '/uploads',
      express.static(resolve(__dirname, '..', 'uploads'))
    );
    this.server.use(routes);
  }

  websocket() {
    // socket.emit() = Emit single client
    // socket.broadcast.emit() = Emit all client except you
    // io.emit() = Emit all client

    const io = socketio(this.httpServer);

    io.origins('*:*');

    io.on('connection', socket => {
      console.log('New websocket connection.');

      // Welcome current user
      socket.broadcast.emit('message', '');

      // Broadcast when a user connects
      socket.broadcast.emit('message', '');

      // Runs when client disconnects
      socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat.');
      });
    });
  }
}

export default new App().httpServer;
