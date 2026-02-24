'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('user', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {type: Sequelize.STRING, allowNull: false, unique: true},
        email: {type: Sequelize.STRING, allowNull: false, unique: true},
        password: Sequelize.STRING
      });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('user');
  }
};
