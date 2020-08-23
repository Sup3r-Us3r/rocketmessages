import 'dotenv/config';

import express from 'express';
import { createServer } from 'http';
// import socketio from 'socket.io';
import cors from 'cors';
import { resolve } from 'path';

import Websocket from './services/Websocket';

import routes from './routes';

class App {
  public server = express();
  public httpServer = createServer(this.server);

  constructor() {
    this.middlewares();
    this.socketio();
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

  socketio() {
    Websocket.socketIO(this.httpServer);
  }
}

export default new App().httpServer;
