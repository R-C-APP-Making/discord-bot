// bots/v1-bot/src/commands/counters/getAllCounters.js

const { SlashCommandBuilder } = require('discord.js');
const { Counters } = require('@utils/database.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('showcounters')
    .setDescription('List all counter names.'),

  /**
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    await interaction.deferReply();

    try {
      const list = await Counters.findAll({ attributes: ['name'] });
      const str =
        list.map((t) => t.get('name')).join(', ') || 'No counters set.';
      return interaction.editReply(`🗂️ List of counters: ${str}`);
    } catch (error) {
      console.error('Error listing counters:', error);
      return interaction.editReply(
        '❌ Something went wrong while listing counters.'
      );
    }
  },
};
