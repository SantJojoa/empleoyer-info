'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Primero, elimina posibles duplicados si existen (para evitar error al agregar UNIQUE)
    await queryInterface.sequelize.query(`
      DELETE FROM "Subscriptions" a
      USING "Subscriptions" b
      WHERE a.id < b.id AND a."userId" = b."userId";
    `);

    // Luego, agrega la restricción UNIQUE
    await queryInterface.addConstraint('Subscriptions', {
      fields: ['userId'],
      type: 'unique',
      name: 'unique_user_subscription'
    });
  },

  async down(queryInterface, Sequelize) {
    // Quita la restricción si se hace rollback
    await queryInterface.removeConstraint('Subscriptions', 'unique_user_subscription');
  }
};
