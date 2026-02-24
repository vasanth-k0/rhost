import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'db/store/database.sqlite',
  logging: console.log
});

try {
  await sequelize.authenticate();
  log('Database connected.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
export {sequelize};
