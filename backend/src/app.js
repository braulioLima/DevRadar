import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import http from 'http';
import routes from './routes';
import { setupWebsocket } from './websocket';

import './database';

class App {
  constructor() {
    this.initServer();
    this.middlewares();
    this.routes();
  }

  initServer() {
    this.server = express();
    this.httpServer = http.Server(this.server);
    setupWebsocket(this.httpServer);
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().httpServer;
