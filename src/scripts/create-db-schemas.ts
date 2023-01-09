// Classes
import Config from '../services/config/Config.js';
import DataBase from '../services/database/Postgres.js';

const config = new Config();
const db = new DataBase(config.postgres);

const run = async () => {
  await db.createSchemas();
};

run();
