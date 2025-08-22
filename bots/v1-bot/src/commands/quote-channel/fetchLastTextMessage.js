// bots/v1-bot/src/commands/quote-channel/fetchLastTextMessage.js

const { SlashCommandBuilder } = require('discord.js');
// Requires Privileged Gateway Intents in /Bots in its section Privileged Gateway Intents
module.exports = {
  data: new SlashCommandBuilder()
    .setName('fetch_last_text_message')
    .setDescription('Fetches last message from Configured Channel.'),
  /**
   * @param {import('discord.js').ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    // interaction.user is the object representing the User who ran the command
    // interaction.member is the GuildMember object, which represents the user in the specific guild
    const channel = await this.fetchChannel(interaction.client);
    if (!channel) {
      return interaction.reply('⚠️ Could not fetch the configured channel.');
    }
    const lastMessage = await this.fetchLastMessage(channel);
    // Log for debugging
    console.log(lastMessage);

    // Send a reply to the user
    await interaction.reply({
      content: lastMessage
        ? `📬 Last message in ${channel.name}:\n${lastMessage.content || '[no text content]'}`
        : '⚠️ Could not fetch the last message.',
      ephemeral: false, // set to true if you want only the user to see it
    });
  },
  /**
   * @param {import('discord.js').Client} client
   */
  async fetchChannel(client) {
    await console.log('fetching channel');
    try {
      const chanId = process.env.QUOTE_CHANNEL;
      if (!chanId) {
        console.error('QUOTE_CHANNEL env var not set');
        return null;
      }
      const channel = await client.channels.fetch(chanId);

      if (channel && channel.isTextBased() && 'messages' in channel) {
        console.log(
          `channel: ${'name' in channel ? channel.name : channel.id}`
        );
        return /** @type {import('discord.js').TextChannel} */ (channel);
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  },
  /**
   * @param {import('discord.js').TextChannel} channel
   * @returns {Promise<import('discord.js').Message | undefined>}
   */
  async fetchLastMessage(channel) {
    const messages = await channel.messages.fetch({ limit: 20 });
    return messages.find((m) => !m.author.bot && m.content.trim().length > 0);
  },
};
