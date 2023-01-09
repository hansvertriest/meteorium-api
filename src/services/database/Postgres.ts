// Node
import pkg from 'pg';
const { Pool } = pkg;
import { Sequelize } from 'sequelize';

// Classes
import ObservationModel from './models/Observation.js';

// Types
import { IPostgresConfig } from '../config/config.types.js';

export default class DataBase {
  private config: IPostgresConfig;
  public pool: any; // deprecated
  public sequelize: Sequelize;

  // models
  public models: {
    observation: ObservationModel;
  };

  constructor(config: IPostgresConfig) {
    this.config = config;
    this.sequelize = new Sequelize(config.conectionString, {
      dialect: 'postgres',
      define: {
        underscored: true,
      },
    });
    this.defineModels();

    // this is legacy
    this.createPool();
  }

  public createSchemas = async () => {
    await this.sequelize.sync();
  };

  private createPool = () => {
    this.pool = new Pool({ connectionString: this.config.conectionString });
  };

  private defineModels = () => {
    this.models = {
      observation: new ObservationModel(this.sequelize),
    };
  };
}
