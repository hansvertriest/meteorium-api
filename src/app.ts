// Node
import express from 'express';
import { createServer, Server } from 'http';
import { Pool } from 'pg';

// Classes
import Router from './router/Router.js';
import GlobalMiddleware from './middleware/GlobalMiddleware.js';

// types
import { IConfig } from './services/config/config.types.js';
import Postgres from './services/database/Postgres.js';

export default class App {
  public app: express.Application;
  public server: Server;
  private pgPool: Pool;
  private config: IConfig;
  private router: Router;
  public db: Postgres;

  constructor(config: IConfig, pool: Pool, db: Postgres) {
    this.config = config;
    this.pgPool = pool;
    this.db = db;

    this.createExpress();
    this.createServer();
    this.createRouter();
  }

  private createExpress = (): void => {
    this.app = express();
    const middleware = new GlobalMiddleware(this.app);
    middleware.load();
  };

  private createServer(): void {
    this.server = createServer(this.app);
    this.server.on('listening', () => {
      console.log('Server listening at ' + this.config.server.host + ':' + this.config.server.port);
    });
    this.server.on('error', (error?: Error) => {
      this.gracefulShutdown(error);
    });
    this.server.on('close', () => {
      console.log('Server is closed!', {});
    });
  }

  private createRouter = (): void => {
    this.router = new Router(this.app, this.pgPool, this.db);
  };

  public start = (): void => {
    this.server.listen(this.config.server.port, this.config.server.host);
  };

  public stop = (): void => {
    this.server.close((error?: Error) => {
      this.gracefulShutdown(error);
    });
  };

  private gracefulShutdown = (error?: Error): void => {
    console.log('Server gracefully shutdown');

    if (error) {
      process.exit(1);
    }
    process.exit();
  };
}
