// bots/v1-bot/src/commands/counters/getCounterInfo.js

const { SlashCommandBuilder, time } = require('discord.js');
const { Counters } = require('@utils/database.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('counterinfo')
    .setDescription('Show metadata about a counter.')
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

      const created = counter.createdAt
        ? time(counter.createdAt, 'F')
        : 'unknown time';
      return interaction.editReply(
        `ℹ️ **${name}** was created by **${counter.username}** at ${created} and has been used **${counter.usage_count}** times.`
      );
    } catch (error) {
      console.error('Error showing counter info:', error);
      return interaction.editReply(
        '❌ Something went wrong while showing counter info.'
      );
    }
  },
};
