// bots/v1-bot/src/commands/utility/user.js

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('Provides information about the user.'),
  /**
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    // Ensure we’re in a guild and the member is cached
    if (!interaction.inCachedGuild() || !interaction.member) {
      return interaction.reply({
        content: '⚠️ This command can only be used in a server.',
        ephemeral: true,
      });
    }

    /** @type {import('discord.js').GuildMember} */
    const member = interaction.member;
    const joined = member.joinedAt
      ? member.joinedAt.toISOString().slice(0, 10)
      : 'an unknown date';

    await interaction.reply(
      `This command was run by ${interaction.user.username}, who joined on ${joined}.`
    );
  },
};
