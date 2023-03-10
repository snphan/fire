import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { DB_TYPE, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } from '@config';

export const dbConnection: DataSourceOptions = {
  type: DB_TYPE == "sqlite" ? "sqlite" : "postgres",
  host: DB_HOST,
  port: parseInt(DB_PORT),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../**/*.migration{.ts,.js}')],
  subscribers: [join(__dirname, '../**/*.subscriber{.ts,.js}')],
};

export const dataSource = new DataSource(dbConnection);