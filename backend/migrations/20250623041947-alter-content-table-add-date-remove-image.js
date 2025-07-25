'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Descreve a estrutura da tabela 'contents'
    const tableInfo = await queryInterface.describeTable('contents');

    // 2. Verifica se a coluna 'date' NÃO existe
    if (!tableInfo.date) {
      console.log("Coluna 'date' não encontrada, adicionando...");
      // 3. Se não existe, adiciona a coluna
      await queryInterface.addColumn('contents', 'date', {
        type: Sequelize.DATE,
        allowNull: true, // Ou false, dependendo da sua regra
      });
    } else {
      console.log("Coluna 'date' já existe, pulando.");
    }

    // Faça o mesmo para a coluna 'image', se precisar removê-la
    if (tableInfo.image) {
      console.log("Coluna 'image' encontrada, removendo...");
      await queryInterface.removeColumn('contents', 'image');
    } else {
      console.log("Coluna 'image' não existe, pulando remoção.");
    }
  },

  async down(queryInterface, Sequelize) {
    // A lógica inversa para a função 'down', tornando-a segura também

    const tableInfo = await queryInterface.describeTable('contents');

    // Se a coluna 'date' existir, remova-a
    if (tableInfo.date) {
      console.log("Coluna 'date' encontrada, removendo...");
      await queryInterface.removeColumn('contents', 'date');
    } else {
      console.log("Coluna 'date' não existe, pulando remoção.");
    }

    // Se a coluna 'image' NÃO existir, adicione-a de volta
    if (!tableInfo.image) {
      console.log("Coluna 'image' não encontrada, adicionando de volta...");
      await queryInterface.addColumn('contents', 'image', {
        type: Sequelize.STRING, // Use o tipo de dados original
        allowNull: true,
      });
    } else {
      console.log("Coluna 'image' já existe, pulando adição.");
    }
  }
};
