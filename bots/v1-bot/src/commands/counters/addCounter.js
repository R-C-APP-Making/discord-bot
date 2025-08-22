// bots/v1-bot/src/commands/counters/add

const { SlashCommandBuilder } = require('discord.js');
const { Counters } = require('@utils/database.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addcounter')
    .setDescription('Create a new counter with a name and description.')
    .addStringOption((opt) =>
      opt
        .setName('name')
        .setDescription('Unique name for the counter')
        .setRequired(true)
    )
    .addStringOption((opt) =>
      opt
        .setName('description')
        .setDescription('A description for the counter')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const name = interaction.options.getString('name');
    const description = interaction.options.getString('description');
    const username = interaction.user.username;

    try {
      const counter = await Counters.create({ name, description, username });
      return interaction.editReply(
        `✅ Counter **${counter.name}** created by **${username}**.`
      );
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return interaction.editReply(
          '⚠️ A counter with that name already exists.'
        );
      }
      console.error('Error creating counter:', error);
      return interaction.editReply(
        '❌ Something went wrong while creating the counter.'
      );
    }
  },
};
