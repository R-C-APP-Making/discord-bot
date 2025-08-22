// bots/v1-bot/src/commands/utility/server.js

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Provides information about the server.'),
  /**
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    // Ensure this command runs in a guild; narrows types so .guild is not null
    if (!interaction.inGuild() || !interaction.guild) {
      return interaction.reply({
        content: '⚠️ This command can only be used in a server.',
        ephemeral: true,
      });
    }
    const guild = interaction.guild; // type = Guild, not Guild | null
    await interaction.reply(
      `This server is ${guild.name} and has ${guild.memberCount} members.`
    );
  },
};
