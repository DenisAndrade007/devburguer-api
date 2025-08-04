'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addIndex('users', ['deleted_at'], {
      name: 'users_deleted_at_idx'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('users', 'users_deleted_at_idx');
    await queryInterface.removeColumn('users', 'deleted_at');
  }
};