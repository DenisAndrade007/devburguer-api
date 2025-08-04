'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Corrige registros existentes
    await queryInterface.sequelize.query(`
      UPDATE users SET password_hash = '' 
      WHERE password_hash IS NULL;
    `);

    // Altera a coluna para NOT NULL
    await queryInterface.changeColumn('users', 'password_hash', {
      type: Sequelize.STRING,
      allowNull: false
    });

    // Adiciona deleted_at se não existir
    const tableInfo = await queryInterface.describeTable('users');
    if (!tableInfo.deleted_at) {
      await queryInterface.addColumn('users', 'deleted_at', {
        type: Sequelize.DATE,
        allowNull: true
      });
    }
  },

  async down(queryInterface) {
    // Reversão opcional (não recomendado em produção)
    await queryInterface.changeColumn('users', 'password_hash', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
};