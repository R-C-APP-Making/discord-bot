// bots/v1-bot/src/commands/counters/deleteCouner.js

const { SlashCommandBuilder } = require('discord.js');
const { Counters } = require('@utils/database.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('deletecounter')
    .setDescription('Delete a counter by name.')
    .addStringOption((opt) =>
      opt
        .setName('name')
        .setDescription('Name of the counter to delete')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const name = interaction.options.getString('name');

    try {
      const rowCount = await Counters.destroy({ where: { name } });
      if (!rowCount)
        return interaction.editReply(
          `⚠️ That counter (**${name}**) doesn't exist.`
        );
      return interaction.editReply('🗑️ Counter deleted.');
    } catch (error) {
      console.error('Error deleting counter:', error);
      return interaction.editReply(
        '❌ Something went wrong while deleting the counter.'
      );
    }
  },
};
