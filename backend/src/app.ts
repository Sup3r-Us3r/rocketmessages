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
    const io = socketio(this.httpServer);

    io.origins('*:*');

    io.on('connection', socket => {
      console.log('New websocket connection.');
    });
  }
}

export default new App().httpServer;
