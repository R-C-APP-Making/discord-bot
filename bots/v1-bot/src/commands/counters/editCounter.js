// bots/v1-bot/src/commands/counters/editCounter.js

const { SlashCommandBuilder } = require('discord.js');
const { Counters } = require('@utils/database.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('editcounter')
    .setDescription('Edit the description of an existing counter.')
    .addStringOption((opt) =>
      opt
        .setName('name')
        .setDescription('Name of the counter to edit')
        .setRequired(true)
    )
    .addStringOption((opt) =>
      opt
        .setName('description')
        .setDescription('New description')
        .setRequired(true)
    ),

  /**
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    await interaction.deferReply();

    const name = interaction.options.getString('name');
    const description = interaction.options.getString('description');

    try {
      const [affectedRows] = await Counters.update(
        { description },
        { where: { name } }
      );
      if (affectedRows > 0)
        return interaction.editReply(`✏️ Counter **${name}** was edited.`);
      return interaction.editReply(
        `⚠️ Could not find a counter named **${name}**.`
      );
    } catch (error) {
      console.error('Error editing counter:', error);
      return interaction.editReply(
        '❌ Something went wrong while editing the counter.'
      );
    }
  },
};
