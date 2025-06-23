'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'contents',
        'date',
        {
          type: Sequelize.DataTypes.DATE,
          allowNull: false,
          defaultValue: new Date(),
        },
        { transaction }
      );

      await queryInterface.removeColumn('contents', 'previewImageUrl', { transaction });
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('contents', 'date', { transaction });

      await queryInterface.addColumn(
        'contents',
        'previewImageUrl',
        {
          type: Sequelize.DataTypes.STRING,
          allowNull: true,
        },
        { transaction }
      );
    });
  }
};
