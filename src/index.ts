// Node
import { Pool } from 'pg';

// Classes
import App from './App.js';
import Config from './services/config/Config.js';
import DataBase from './services/database/Postgres.js';

// types
import { IConfig } from './services/config/config.types.js';

// create config service
const config: IConfig = new Config();

// Set timezone to GMT+0000
process.env.TZ = 'Africa/Abidjan';

try {
  // Create a postgres pool
  const db = new DataBase(config.postgres);
  const pool: Pool = db.pool;

  // create application
  const app: App = new App(config, pool);
  app.start();

  // Stop all running processes
  const stopAllProcesses = async () => {
    app.stop();

    console.log('All processes were terminated');
  };

  process.on('SIGINT', () => stopAllProcesses());
  process.on('SIGTERM', () => stopAllProcesses());
} catch (error) {
  console.log(error);
}
