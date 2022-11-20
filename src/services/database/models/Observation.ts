// Node
import { Sequelize, DataTypes } from 'sequelize';
import { Source } from '../../../sources/d.types';

type Observation = {
  id: number;
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
  network: number;
  source: Source;
};

export default class ObservationModel {
  private model: any;

  constructor(sq: Sequelize) {
    const config: Record<keyof Observation, any> = {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
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
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      source: {
        type: DataTypes.ENUM(...Object.values(Source)),
        allowNull: false,
      },
    };
    this.model = sq.define('observation', config);
  }
}