// Node
import { Sequelize, DataTypes, ModelDefined, Model } from 'sequelize';
import { Source } from '../../../sources/d.types.js';

// Types
import { Network } from '../../../types/Observation.js';

export type ObservationType = {
  time: Date;
  date: Date;
  t_begin: number;
  lat_begin: number;
  lon_begin: number;
  h_begin: number;
  t_end: number;
  lat_end: number;
  lon_end: number;
  h_end: number;
  iau_no: number;
  stations: string;
  network: Network;
  source: Source;
};

export default class ObservationModel {
  private model: ModelDefined<ObservationType, ObservationType>;

  constructor(sq: Sequelize) {
    const config: Record<keyof ObservationType | 'id', any> = {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      t_begin: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      lat_begin: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      lon_begin: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      h_begin: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      t_end: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      lat_end: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      lon_end: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      h_end: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      iau_no: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      stations: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      network: {
        type: DataTypes.ENUM(...Object.values(Network)),
        allowNull: false,
      },
      source: {
        type: DataTypes.ENUM(...Object.values(Source)),
        allowNull: false,
      },
    };
    this.model = sq.define('observation', config);
  }

  public getLatestDate = async (): Promise<Date> => {
    const latestDate = await this.model.max<Date, Model<ObservationType, ObservationType>>('date');
    return new Date(latestDate);
  };

  public createMultiple = async (observations: ObservationType[]) => {
    return await this.model.bulkCreate(observations);
  };
}
