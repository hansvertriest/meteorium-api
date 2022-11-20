// Node
import { Pool } from 'pg';
import { Sequelize } from 'sequelize';

// Classes
import ObservationModel from './models/Observation.js';

// Types
import { IPostgresConfig } from '../config/config.types.js';

export default class DataBase {
  private config: IPostgresConfig;
  public pool: Pool; // deprecated
  public sequelize: Sequelize;

  // models
  public models: {
    observation: ObservationModel;
  };

  constructor(config: IPostgresConfig) {
    this.config = config;
    this.sequelize = new Sequelize(config.conectionString);
    this.defineModels();

    // this is legacy
    this.createPool();
  }

  private createPool = () => {
    this.pool = new Pool({ connectionString: this.config.conectionString });
  };

  private defineModels = () => {
    this.models = {
      observation: new ObservationModel(this.sequelize),
    };
  };
}
