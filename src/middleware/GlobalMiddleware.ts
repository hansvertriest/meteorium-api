// Node
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

export default class GlobalMiddleware {
  private app: express.Application;

  constructor(app: express.Application) {
    this.app = app;
  }

  public load = () => {
    this.app.use(express.json());
    this.app.use(express.urlencoded());
    this.app.use(morgan());
    this.app.use(cors());
  };
}
