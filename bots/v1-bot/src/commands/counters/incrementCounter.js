// bots/v1-bot/src/commands/counters/incrementCounter.js

const { SlashCommandBuilder } = require('discord.js');
const { Counters } = require('@utils/database.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('increment_counter')
    .setDescription('Fetch a counter by name and increment its usage count.')
    .addStringOption((opt) =>
      opt
        .setName('name')
        .setDescription('Name of the counter')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const name = interaction.options.getString('name');

    try {
      const counter = await Counters.findOne({ where: { name } });
      if (!counter)
        return interaction.editReply(`⚠️ Could not find counter: **${name}**`);

      await counter.increment('usage_count');
      return interaction.editReply(counter.get('description'));
    } catch (error) {
      console.error('Error fetching counter:', error);
      return interaction.editReply(
        '❌ Something went wrong while fetching the counter.'
      );
    }
  },
};
